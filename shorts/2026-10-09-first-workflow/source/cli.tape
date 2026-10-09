Output ../raw/cli.mp4
Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 21
Set Width 1920
Set Height 1080
Set Padding 60
Set Margin 0
Set LineHeight 1.25
Set TypingSpeed 55ms
Set CursorBlink false
Set WaitTimeout 90s
Set Theme { "name": "Keelson", "background": "#0d1429", "foreground": "#d8dcf0", "cursor": "#9b8eff", "selection": "#2a3352", "black": "#131a30", "red": "#ff6b8a", "green": "#5fd7a7", "yellow": "#f2c66d", "blue": "#7aa2ff", "magenta": "#9b8eff", "cyan": "#5fd7d7", "white": "#d8dcf0", "brightBlack": "#5b6488", "brightRed": "#ff8fa6", "brightGreen": "#7fe7bb", "brightYellow": "#ffd88a", "brightBlue": "#9bbaff", "brightMagenta": "#b8adff", "brightCyan": "#8eeaea", "brightWhite": "#ffffff" }
Hide
Type "export KEELSON_HOME=/Users/Shared/keelson-demo/.keelson PORT=7979 KEELSON_SERVER_URL=http://127.0.0.1:7979 PATH=/Users/Shared/keelson-demo/bin:$PATH BASH_SILENCE_DEPRECATION_WARNING=1" Enter
Type `keelson() { command keelson "$@" 2> >(grep -v --line-buffered 'dropping unknown reasoning' >&2); }` Enter
Hide
Type "export KEELSON_HOME=/Users/Shared/keelson-demo/.keelson PORT=7979 KEELSON_SERVER_URL=http://127.0.0.1:7979 PATH=/Users/Shared/keelson-demo/bin:$PATH BASH_SILENCE_DEPRECATION_WARNING=1" Enter
Type `keelson() { command keelson "$@" 2> >(grep -v --line-buffered 'dropping unknown reasoning' >&2); }` Enter
Type "cd /Users/Shared/keelson-demo && export PS1='\[\e[38;5;141m\]keelson-demo\[\e[0m\] $ ' && clear" Enter
Sleep 600ms
Show
Sleep 600ms
Type "keelson workflow run smoke-test --watch"
Sleep 400ms
Enter
Wait /keelson-demo \$$/
Sleep 4s
