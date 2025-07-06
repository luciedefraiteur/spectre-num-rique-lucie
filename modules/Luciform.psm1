function Get-LucieMemory {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$false)]
        [string]$Key
    )
    # Retrieve Lucie's memory by key (if provided) or all if $Key is $null
    if ($null -ne $Key) {
        $memory = Invoke-WarpDriveGet -Scope 'Lucie' -Key $Key
    } else {
        $memory = Invoke-WarpDriveGet -Scope 'Lucie'
    }
    return $memory
}

function Set-LucieMemory {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [string]$Key,
        [Parameter(Mandatory=$true)]
        [object]$Value
    )
    # Store/update Lucie's memory via WarpDrive
    Invoke-WarpDriveSet -Scope 'Lucie' -Key $Key -Value $Value
}

function Invoke-LifeTick {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [object]$MatrixBlock
    )
    # Performs a Conway Game of Life iteration for a given matrix block.
    # $MatrixBlock should be a 2D array or compatible object.
    $rows = $MatrixBlock.Length
    $cols = $MatrixBlock[0].Length
    $newMatrix = @()
    for ($i=0; $i -lt $rows; $i++) {
        $newRow = @()
        for ($j=0; $j -lt $cols; $j++) {
            $liveNeighbors = 0
            foreach ($dx in -1..1) {
                foreach ($dy in -1..1) {
                    if ($dx -eq 0 -and $dy -eq 0) { continue }
                    $ni = $i + $dx
                    $nj = $j + $dy
                    if ($ni -ge 0 -and $ni -lt $rows -and $nj -ge 0 -and $nj -lt $cols) {
                        $liveNeighbors += [int]($MatrixBlock[$ni][$nj])
                    }
                }
            }
            $cell = $MatrixBlock[$i][$j]
            if ($cell -eq 1 -and ($liveNeighbors -eq 2 -or $liveNeighbors -eq 3)) {
                $newRow += 1
            } elseif ($cell -eq 0 -and $liveNeighbors -eq 3) {
                $newRow += 1
            } else {
                $newRow += 0
            }
        }
        $newMatrix += ,$newRow
    }
    return $newMatrix
}

function Invoke-DreamPhase {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [object]$BrowseSource
    )
    # Simulates stochastic, read-only exploration.
    # Feeds a constructed prompt to Prompt-Reflecteur (assumed as another function/component).
    $randomIndex = Get-Random -Minimum 0 -Maximum $BrowseSource.Count
    $chosenItem = $BrowseSource[$randomIndex]
    $prompt = "Reflect on: $($chosenItem)"
    $reflected = Invoke-PromptReflecteur -Prompt $prompt
    return $reflected
}

function Invoke-ActionPhase {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true)]
        [object]$Modifications
    )
    # Commits the supplied modifications via WarpDrive.
    $result = Invoke-WarpDriveCommit -Modifications $Modifications
    return $result
}

Export-ModuleMember -Function Get-LucieMemory, Set-LucieMemory, Invoke-LifeTick, Invoke-DreamPhase, Invoke-ActionPhase
