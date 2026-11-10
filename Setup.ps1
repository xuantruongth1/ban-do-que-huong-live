param([switch]$NoBrowser,[switch]$InstallOnly)
$ErrorActionPreference='Stop'
$ProgressPreference='SilentlyContinue'
[Console]::OutputEncoding=[System.Text.UTF8Encoding]::new($false)
[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12
$appRoot=Split-Path -Parent $PSCommandPath
$release=Get-Content -LiteralPath (Join-Path $appRoot 'release-manifest.json') -Raw -Encoding UTF8 | ConvertFrom-Json
if(-not [Environment]::Is64BitOperatingSystem){throw 'Bản này dùng cho Windows 64-bit.'}
function Assert-InApp([string]$Target){$absolute=[IO.Path]::GetFullPath($Target);if(-not $absolute.StartsWith([IO.Path]::GetFullPath($appRoot)+[IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)){throw 'Đường dẫn cài đặt ngoài thư mục tool.'};return $absolute}
function Get-ArchiveSha([string]$File){$stream=[IO.File]::OpenRead($File);$algorithm=[Security.Cryptography.SHA256]::Create();try{return [BitConverter]::ToString($algorithm.ComputeHash($stream)).Replace('-','').ToLowerInvariant()}finally{$algorithm.Dispose();$stream.Dispose()}}
function Expand-CheckedZip([string]$Archive,[string]$Destination){
 Add-Type -AssemblyName System.IO.Compression.FileSystem
 $destinationRoot=[IO.Path]::GetFullPath($Destination).TrimEnd('\')+'\'
 $zipReader=[IO.Compression.ZipFile]::OpenRead($Archive)
 try{foreach($entry in $zipReader.Entries){
  $target=[IO.Path]::GetFullPath((Join-Path $Destination $entry.FullName.Replace('/',[IO.Path]::DirectorySeparatorChar)))
  if(-not $target.StartsWith($destinationRoot,[StringComparison]::OrdinalIgnoreCase)){throw 'Archive chứa đường dẫn ngoài thư mục cài đặt.'}
  $longTarget='\\?\'+$target
  if($entry.Name -eq ''){[IO.Directory]::CreateDirectory($longTarget)|Out-Null;continue}
  [IO.Directory]::CreateDirectory('\\?\'+[IO.Path]::GetDirectoryName($target))|Out-Null
  $inputStream=$entry.Open();$outputStream=[IO.File]::Open($longTarget,[IO.FileMode]::Create,[IO.FileAccess]::Write,[IO.FileShare]::None)
  try{$inputStream.CopyTo($outputStream,1048576)}finally{$outputStream.Dispose();$inputStream.Dispose()}
 }}finally{$zipReader.Dispose()}
}
function Install-Payload($Asset,[string[]]$Folders){
 $marker=Join-Path $appRoot ('.installed-'+$Asset.name+'.txt')
 if((Test-Path -LiteralPath $marker) -and ((Get-Content -LiteralPath $marker -Raw).Trim() -eq $Asset.sha256)){return}
 $cache=Join-Path $appRoot '.downloads';New-Item -ItemType Directory -Path $cache -Force | Out-Null
 $zip=Assert-InApp (Join-Path $cache $Asset.name)
 if(-not (Test-Path -LiteralPath $zip) -or (Get-ArchiveSha $zip) -ne $Asset.sha256){
  Write-Host ('Đang tải '+$Asset.label+' — lần đầu có thể mất vài phút…')
  Invoke-WebRequest -Uri $Asset.url -OutFile $zip -UseBasicParsing
 }
 if((Get-ArchiveSha $zip) -ne $Asset.sha256){throw ('Checksum không khớp: '+$Asset.name+'. Chạy lại để tải lại.')}
 $stage=Assert-InApp (Join-Path $appRoot ('.setup-'+[guid]::NewGuid().ToString('N')))
 Write-Host ('Đang giải nén '+$Asset.label+'…');Expand-CheckedZip $zip $stage
 foreach($folder in $Folders){$from=Join-Path $stage $folder;$target=Assert-InApp (Join-Path $appRoot $folder);if(Test-Path -LiteralPath $target){Copy-Item -LiteralPath $from -Destination (Split-Path $target -Parent) -Recurse -Force}else{Move-Item -LiteralPath $from -Destination $target}}
 Set-Content -LiteralPath $marker -Value $Asset.sha256 -Encoding ascii
 $checkedStage=Assert-InApp $stage;Remove-Item -LiteralPath $checkedStage -Recurse -Force
}
Install-Payload $release.runtime @('runtime','resources','node_modules')
Install-Payload $release.clips @('content')
if($InstallOnly){Write-Host 'Tài nguyên đã sẵn sàng.';return}
$dataPath=Join-Path $appRoot 'data';New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
$portNumber=3195;if($env:HOMETOWN_PORT){$portNumber=[int]$env:HOMETOWN_PORT};$baseUrl='http://127.0.0.1:'+$portNumber
$healthy=$false;try{$state=Invoke-RestMethod ($baseUrl+'/api/state') -TimeoutSec 2;$healthy=$state.schema -eq 2}catch{}
if(-not $healthy){
 $nodeExe=Join-Path $appRoot 'runtime/node.exe';$entry=Join-Path $appRoot 'run.mjs'
 Start-Process -FilePath $nodeExe -ArgumentList ('"'+$entry+'"') -WorkingDirectory $appRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $dataPath 'server.log') -RedirectStandardError (Join-Path $dataPath 'server-error.log') | Out-Null
 for($attempt=0;$attempt -lt 60;$attempt++){Start-Sleep -Milliseconds 250;try{$state=Invoke-RestMethod ($baseUrl+'/api/state') -TimeoutSec 2;if($state.schema -eq 2){$healthy=$true;break}}catch{}}
}
if(-not $healthy){throw 'Không mở được tool. Xem data/server-error.log.'}
Write-Host ('Tool đã sẵn sàng: '+$baseUrl)
if(-not $NoBrowser){Start-Process $baseUrl}
