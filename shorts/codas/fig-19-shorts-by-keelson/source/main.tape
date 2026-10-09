Output ../raw/main.mp4
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
Set WaitTimeout 1500s
Set Theme { "name": "Keelson", "background": "#0d1429", "foreground": "#d8dcf0", "cursor": "#9b8eff", "selection": "#2a3352", "black": "#131a30", "red": "#ff6b8a", "green": "#5fd7a7", "yellow": "#f2c66d", "blue": "#7aa2ff", "magenta": "#9b8eff", "cyan": "#5fd7d7", "white": "#d8dcf0", "brightBlack": "#5b6488", "brightRed": "#ff8fa6", "brightGreen": "#7fe7bb", "brightYellow": "#ffd88a", "brightBlue": "#9bbaff", "brightMagenta": "#b8adff", "brightCyan": "#8eeaea", "brightWhite": "#ffffff" }
Set WaitTimeout 1500s
Hide
Type "export KEELSON_HOME=/Users/Shared/keelson-demo/.keelson PORT=7979 KEELSON_SERVER_URL=http://127.0.0.1:7979 PATH=/Users/Shared/keelson-demo/bin:$PATH BASH_SILENCE_DEPRECATION_WARNING=1" Enter
Type "cd /Users/Shared/keelson-demo/shorts && export PS1='\[\e[38;5;141m\]shorts\[\e[0m\] $ ' && clear" Enter
Sleep 600ms
Show
Sleep 600ms
Type "grep -n 'id: n3b' shorts/codas/fig-16-no-paid-keys/short.yaml | cut -c1-110"
Sleep 300ms
Enter
Sleep 2.5s
Type "sed -i '' 's/The answer came from a model on/That answer came from a model running on/' shorts/codas/fig-16-no-paid-keys/short.yaml"
Sleep 300ms
Enter
Sleep 600ms
Type "git diff --word-diff=color -U0 shorts/codas/fig-16-no-paid-keys/short.yaml | tail -n 1 | cut -c1-150"
Sleep 300ms
Enter
Sleep 4s
Type "clear" Enter
Sleep 300ms
Type "keelson workflow run cut-a-short --project shorts --arguments shorts/codas/fig-16-no-paid-keys"
Sleep 400ms
Enter
Wait+Screen@900s /awaiting approval|requires the server/
Sleep 3s
Wait+Screen@900s /staged outbox/
Sleep 1s
Wait@60s /shorts \$$/
Sleep 4s
