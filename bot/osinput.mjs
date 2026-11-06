// Tryb „Przeglądarka”: prawdziwa klawiatura i kursor Windowsa (SendInput / mouse_event przez PowerShell).
// Jeden proces PowerShell na wejście czyta polecenia z wejścia i odpowiada linią „OK …” albo „ERR …”.
// Działa tylko na Windowsie i tylko z widocznym oknem przeglądarki; w tym czasie użytkownik nie powinien ruszać myszą ani klawiaturą.
import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";

const PS = String.raw`
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @"
using System; using System.Runtime.InteropServices; using System.Text;
public static class HB {
  [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
  [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
  [StructLayout(LayoutKind.Sequential)] public struct POINT { public int X; public int Y; }
  [DllImport("user32.dll")] public static extern bool GetCursorPos(out POINT p);
  [DllImport("user32.dll")] public static extern void mouse_event(uint f, int dx, int dy, int data, UIntPtr extra);
  [DllImport("user32.dll")] public static extern void keybd_event(byte vk, byte scan, uint f, UIntPtr extra);
  [DllImport("user32.dll")] public static extern uint MapVirtualKey(uint code, uint type);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, IntPtr p);
  [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();
  [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint a, uint b, bool f);
  [StructLayout(LayoutKind.Sequential)] public struct RECT { public int L; public int T; public int R; public int B; }
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
  [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetClassName(IntPtr h, StringBuilder s, int n);
  [DllImport("winmm.dll")] public static extern uint timeBeginPeriod(uint p);
  [StructLayout(LayoutKind.Sequential)] public struct KEYBDINPUT { public ushort wVk; public ushort wScan; public uint dwFlags; public uint time; public IntPtr dwExtraInfo; }
  [StructLayout(LayoutKind.Sequential)] public struct MOUSEINPUT { public int dx; public int dy; public uint mouseData; public uint dwFlags; public uint time; public IntPtr dwExtraInfo; }
  [StructLayout(LayoutKind.Explicit)] public struct UNION { [FieldOffset(0)] public MOUSEINPUT mi; [FieldOffset(0)] public KEYBDINPUT ki; }
  [StructLayout(LayoutKind.Sequential)] public struct INPUT { public uint type; public UNION u; }
  [DllImport("user32.dll")] public static extern uint SendInput(uint n, INPUT[] i, int size);
  public static void Uni(ushort c, bool up) { INPUT[] i = new INPUT[1]; i[0].type = 1; i[0].u.ki.wScan = c; i[0].u.ki.dwFlags = 4u | (up ? 2u : 0u); SendInput(1, i, Marshal.SizeOf(typeof(INPUT))); }
  public static void Key(byte vk, bool ext, bool up) { keybd_event(vk, (byte)MapVirtualKey(vk, 0), (ext ? 1u : 0u) | (up ? 2u : 0u), UIntPtr.Zero); }
  public static void Activate(IntPtr h) {
    if (IsIconic(h)) ShowWindow(h, 9);
    uint a = GetCurrentThreadId(), b = GetWindowThreadProcessId(GetForegroundWindow(), IntPtr.Zero);
    if (a != b) AttachThreadInput(a, b, true);
    BringWindowToTop(h); SetForegroundWindow(h);
    if (a != b) AttachThreadInput(a, b, false);
  }
  public static string Cls(IntPtr h) { StringBuilder s = new StringBuilder(256); GetClassName(h, s, 256); return s.ToString(); }
}
"@
[HB]::SetProcessDPIAware() | Out-Null
[HB]::timeBeginPeriod(1) | Out-Null
$BTN = @{ left = @(2, 4); right = @(8, 16); middle = @(32, 64) }
[Console]::Out.WriteLine('OK gotowy'); [Console]::Out.Flush()
while ($null -ne ($line = [Console]::In.ReadLine())) {
  $a = $line.Split(' ')
  try {
    switch ($a[0]) {
      'M' { [HB]::SetCursorPos([int]$a[1], [int]$a[2]) | Out-Null; $r = 'OK' }
      'D' { [HB]::mouse_event($BTN[$a[1]][0], 0, 0, 0, [UIntPtr]::Zero); $r = 'OK' }
      'U' { [HB]::mouse_event($BTN[$a[1]][1], 0, 0, 0, [UIntPtr]::Zero); $r = 'OK' }
      'W' { [HB]::mouse_event(0x800, 0, 0, [int]$a[1], [UIntPtr]::Zero); $r = 'OK' }
      'K' { [HB]::Key([byte][int]$a[1], $a[2] -eq '1', $a[3] -eq '1'); $r = 'OK' }
      'C' { [HB]::Uni([uint16][int]$a[1], $a[2] -eq '1'); $r = 'OK' }
      'POS' { $p = New-Object HB+POINT; [HB]::GetCursorPos([ref]$p) | Out-Null; $r = "OK $($p.X) $($p.Y)" }
      'FG' { $h = [HB]::GetForegroundWindow(); $rc = New-Object HB+RECT; [HB]::GetWindowRect($h, [ref]$rc) | Out-Null; $r = "OK $([int64]$h) $($rc.L) $($rc.T) $($rc.R) $($rc.B) $([HB]::Cls($h))" }
      'ACT' { $h = [IntPtr][int64]$a[1]; [HB]::Activate($h); $rc = New-Object HB+RECT; [HB]::GetWindowRect($h, [ref]$rc) | Out-Null; $ok = [HB]::GetForegroundWindow() -eq $h; $r = "OK $([int]$ok) $($rc.L) $($rc.T) $($rc.R) $($rc.B)" }
      'SHOT' { $w = [int]$a[3]; $hh = [int]$a[4]; $bmp = New-Object System.Drawing.Bitmap $w, $hh; $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.CopyFromScreen([int]$a[1], [int]$a[2], 0, 0, (New-Object System.Drawing.Size $w, $hh)); $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png); $g.Dispose(); $bmp.Dispose(); $r = 'OK ' + [Convert]::ToBase64String($ms.ToArray()) }
      'REL' { foreach ($b in $BTN.Values) { [HB]::mouse_event($b[1], 0, 0, 0, [UIntPtr]::Zero) }; foreach ($k in 0x10, 0x11, 0x12, 0x5B) { [HB]::Key([byte]$k, $false, $true) }; $r = 'OK' }
      default { $r = "ERR nieznane polecenie $($a[0])" }
    }
  } catch { $r = 'ERR ' + ($_.Exception.Message -replace '\s+', ' ') }
  [Console]::Out.WriteLine($r); [Console]::Out.Flush()
}
`;

// klawisze z panelu (nazwy jak w Playwrighcie) → kody wirtualne Windowsa; ext = klawisz „rozszerzony”
const VK = { Control: 0x11, Shift: 0x10, Alt: 0x12, Meta: 0x5B, Enter: 0x0D, Tab: 0x09, Escape: 0x1B, Space: 0x20, " ": 0x20, Backspace: 0x08, Delete: 0x2E, Insert: 0x2D,
  ArrowLeft: 0x25, ArrowUp: 0x26, ArrowRight: 0x27, ArrowDown: 0x28, PageUp: 0x21, PageDown: 0x22, End: 0x23, Home: 0x24, Plus: 0xBB, Equal: 0xBB, Minus: 0xBD,
  Comma: 0xBC, Period: 0xBE, Slash: 0xBF, CapsLock: 0x14, ContextMenu: 0x5D };
const EXT = new Set([0x2E, 0x2D, 0x25, 0x26, 0x27, 0x28, 0x21, 0x22, 0x23, 0x24, 0x5B, 0x5D]);
export function vkOf(k){
  if (k in VK) return VK[k];
  if (/^[A-Z]$/i.test(k)) return k.toUpperCase().charCodeAt(0);
  if (/^[0-9]$/.test(k)) return k.charCodeAt(0);
  const f = /^F([1-9]|1[0-9]|2[0-4])$/.exec(k); if (f) return 0x6F + +f[1];
  throw new Error(`klawisza „${k}” nie da się nacisnąć w trybie „Przeglądarka”`);
}

export class OsInput {
  static async open(){
    if (process.platform !== "win32") throw new Error("tryb „Przeglądarka” działa tylko na Windowsie");
    const file = join(tmpdir(), `human-bot-wejscie-${process.pid}.ps1`);
    await writeFile(file, "﻿" + PS);   // BOM – PowerShell 5 czyta wtedy plik jako UTF-8
    const os = new OsInput();
    os.proc = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-File", file], { stdio: ["pipe", "pipe", "pipe"], windowsHide: true });
    os.queue = []; os.err = "";
    os.proc.stderr.on("data", d => { os.err += d; });
    createInterface({ input: os.proc.stdout }).on("line", l => { const q = os.queue.shift(); if (!q) return;
      if (l.startsWith("OK")) q.ok(l.slice(3)); else q.no(new Error(l.replace(/^ERR\s*/, "") || "błąd sterownika")); });
    os.proc.on("exit", () => { for (const q of os.queue.splice(0)) q.no(new Error("sterownik wejścia zakończył się: " + (os.err.trim().split("\n")[0] || "?"))); });
    const ready = new Promise((ok, no) => os.queue.push({ ok, no }));
    await Promise.race([ready, new Promise((_, no) => setTimeout(() => no(new Error("sterownik wejścia (PowerShell) nie odpowiada")), 20000))]);
    return os;
  }
  send(cmd){ return new Promise((ok, no) => { this.queue.push({ ok, no }); this.proc.stdin.write(cmd + "\n"); }); }
  async close(){ try { await this.send("REL"); } catch (_) {} this.proc.stdin.end(); setTimeout(() => this.proc.kill(), 1000).unref(); }

  move(x, y){ return this.send(`M ${Math.round(x)} ${Math.round(y)}`); }
  down(b = "left"){ return this.send(`D ${b}`); }
  up(b = "left"){ return this.send(`U ${b}`); }
  wheel(dy){ return this.send(`W ${Math.round(-dy * 1.2)}`); }   // ok. 100 px strony = jedno „kliknięcie” kółka (120)
  key(name, up){ const vk = vkOf(name); return this.send(`K ${vk} ${EXT.has(vk) ? 1 : 0} ${up ? 1 : 0}`); }
  async char(ch, up){ for (const u of ch.split("")) await this.send(`C ${u.charCodeAt(0)} ${up ? 1 : 0}`); }   // znak przez Unicode – też polskie litery
  async pos(){ const [x, y] = (await this.send("POS")).split(" ").map(Number); return { x, y }; }
  async foreground(){ const [h, l, t, r, b, ...cls] = (await this.send("FG")).split(" "); return { hwnd: h, rect: { l: +l, t: +t, r: +r, b: +b }, cls: cls.join(" ") }; }
  async activate(hwnd){ const [ok, l, t, r, b] = (await this.send(`ACT ${hwnd}`)).split(" "); return { ok: ok === "1", rect: { l: +l, t: +t, r: +r, b: +b } }; }
  async shot(l, t, w, h){ return Buffer.from(await this.send(`SHOT ${Math.round(l)} ${Math.round(t)} ${Math.round(w)} ${Math.round(h)}`), "base64"); }
}
