Output term.mp4
Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 20
Set Width 1920
Set Height 1080
Set Padding 50
Set Margin 0
Set LineHeight 1.2
Set TypingSpeed 55ms
Set CursorBlink false
Set Theme { "name": "Keelson", "background": "#0d1429", "foreground": "#d8dcf0", "cursor": "#9b8eff", "selection": "#2a3352", "black": "#131a30", "red": "#ff6b8a", "green": "#5fd7a7", "yellow": "#f2c66d", "blue": "#7aa2ff", "magenta": "#9b8eff", "cyan": "#5fd7d7", "white": "#d8dcf0", "brightBlack": "#5b6488", "brightRed": "#ff8fa6", "brightGreen": "#7fe7bb", "brightYellow": "#ffd88a", "brightBlue": "#9bbaff", "brightMagenta": "#b8adff", "brightCyan": "#8eeaea", "brightWhite": "#ffffff" }

Hide
Type "export KEELSON_HOME=$HOME/keelson-demo/.keelson PORT=7979 KEELSON_SERVER_URL=http://127.0.0.1:7979 BASH_SILENCE_DEPRECATION_WARNING=1" Enter
Type "cd ~/keelson-demo && export PS1='\[\e[38;5;141m\]keelson-demo\[\e[0m\] $ ' && clear" Enter
Sleep 500ms
Show

Sleep 500ms
Type "keelson start"
Sleep 300ms
Enter
Sleep 2150ms
Hide
Type "clear" Enter
Sleep 200ms
Show
Type "keelson workflow run smoke-test"
Sleep 300ms
Enter
Sleep 13300ms
