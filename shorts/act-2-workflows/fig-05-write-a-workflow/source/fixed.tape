Output ../raw/fixed.mp4
Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 26
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
Type `alias vim='vim -u NONE -N -c "syntax on" -c "set nu"'` Enter
Type "cd /Users/Shared/keelson-demo/harbor && export PS1='\[\e[38;5;141m\]harbor\[\e[0m\] $ ' && clear" Enter
Sleep 600ms
Show
Sleep 600ms
Type "vim +17 .keelson/workflows/tide-check.yaml"
Sleep 400ms
Enter
Sleep 2s
Type "f]"
Sleep 500ms
Type "i"
Sleep 200ms
Type "s"
Sleep 300ms
Escape
Sleep 1.4s
Type ":wq"
Sleep 300ms
Enter
Hide
Type "clear"
Enter
Show
Sleep 300ms
Type "keelson workflow validate tide-check --dir .keelson/workflows"
Sleep 400ms
Enter
Sleep 4s
Hide
Type "clear"
Enter
Show
Sleep 300ms
Type "keelson workflow run tide-check --project harbor --watch"
Sleep 400ms
Enter
Wait /harbor \$$/
Sleep 4s
