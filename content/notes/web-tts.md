---
title: 文字转语音（WebAPI）
date: '2024-11-17 14:11:21'
path: /notes/web-tts
---

## Web Speech API


```js [speak.js]
function speak(text) {
  const utt = new SpeechSynthesisUtterance()
  utt.text = text
  utt.lang = 'zh-CN'

  window.speechSynthesis.speak(utt)

  const aliveSpeechInterval = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(aliveSpeechInterval)
    } else {
      speechSynthesis.pause()
      speechSynthesis.resume()
    }
  }, 14000)
}

```

