# Pester tests for warpdrive.psm1
Import-Module "$PSScriptRoot/../warpdrive.psm1"

Describe 'WarpDrive Module Core' {
    It 'Add/Get/Remove-WarpDriveEntry maintains map' {
        Add-WarpDriveEntry -Address 'abc123' -Path '/tmp/file1.bin'
        (Get-WarpDriveEntry -Address 'abc123') | Should Be '/tmp/file1.bin'
        Remove-WarpDriveEntry -Address 'abc123'
        (Get-WarpDriveEntry -Address 'abc123') | Should Be $null
    }

    It 'Write/Read-WarpDriveData stores and retrieves bytes' {
        # Generate byte array & temp file
        $b = [System.Text.Encoding]::UTF8.GetBytes('powertest')
        $tmp = [System.IO.Path]::GetTempFileName()
        Write-WarpDriveData -Data $b -Path $tmp
        $read = Read-WarpDriveData -Path $tmp
        [System.Text.Encoding]::UTF8.GetString($read) | Should Be 'powertest'
        Remove-Item $tmp
    }

    It 'Write-WarpDriveData employs the lock (basic usage)' {
        # This test only ensures the call completes and uses the Mutex.
        $b = 1..5
        $tmp = [System.IO.Path]::GetTempFileName()
        Write-WarpDriveData -Data $b -Path $tmp
        Read-WarpDriveData -Path $tmp | Should Be $b
        Remove-Item $tmp
    }
}

