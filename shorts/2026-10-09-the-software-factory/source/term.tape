Output ../raw/term.mp4
Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 20
Set Width 1920
Set Height 1080
Set Padding 60
Set Margin 0
Set LineHeight 1.25
Set TypingSpeed 55ms
Set CursorBlink false
Set WaitTimeout 600s
Set Theme { "name": "Keelson", "background": "#0d1429", "foreground": "#d8dcf0", "cursor": "#9b8eff", "selection": "#2a3352", "black": "#131a30", "red": "#ff6b8a", "green": "#5fd7a7", "yellow": "#f2c66d", "blue": "#7aa2ff", "magenta": "#9b8eff", "cyan": "#5fd7d7", "white": "#d8dcf0", "brightBlack": "#5b6488", "brightRed": "#ff8fa6", "brightGreen": "#7fe7bb", "brightYellow": "#ffd88a", "brightBlue": "#9bbaff", "brightMagenta": "#b8adff", "brightCyan": "#8eeaea", "brightWhite": "#ffffff" }
Hide
Type "export PATH=/Users/Shared/keelson-demo/bin:$PATH BASH_SILENCE_DEPRECATION_WARNING=1" Enter
Type "cd /Users/Shared/keelson-demo/cosmos-factory && export PS1='\[\e[38;5;141m\]cosmos-factory\[\e[0m\] $ ' && clear" Enter
Sleep 600ms
Show
Sleep 600ms
Type "git log --oneline --first-parent main | head -13"
Sleep 300ms
Enter
Sleep 6s
Type "bun test 2>&1 | tail -4"
Sleep 300ms
Enter
Wait+Screen@120s /Ran [0-9]+ tests/
Sleep 5s
