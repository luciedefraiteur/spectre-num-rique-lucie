# WarpDrive PowerShell Module
# Provides core storage and retrieval functionality with binary speed and concurrency safety

# -----------------------
# In-Memory Address Map
# -----------------------
if (-not $script:AddressMap) {
    $script:AddressMap = @{}
}

# --------------------
# Global File Lock
# --------------------
if (-not $script:WarpDriveMutex) {
    $script:WarpDriveMutex = New-Object System.Threading.Mutex($false, 'Global_WarpDriveMutex')
}

function Add-WarpDriveEntry {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Address,
        [Parameter(Mandatory)] [string]$Path
    )
    $script:AddressMap[$Address] = $Path
}

function Get-WarpDriveEntry {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Address
    )
    return $script:AddressMap[$Address]
}

function Remove-WarpDriveEntry {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Address
    )
    $script:AddressMap.Remove($Address) | Out-Null
}

function Write-WarpDriveData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [byte[]]$Data,
        [Parameter(Mandatory)] [string]$Path
    )
    $null = $script:WarpDriveMutex.WaitOne()
    try {
        [System.IO.File]::WriteAllBytes($Path, $Data)
    }
    finally {
        $script:WarpDriveMutex.ReleaseMutex() | Out-Null
    }
}

function Read-WarpDriveData {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory)] [string]$Path
    )
    return [System.IO.File]::ReadAllBytes($Path)
}

Export-ModuleMember -Function '*-WarpDrive*'

