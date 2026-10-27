function externalSpeechUrl(template, text) {
    if (!template.includes('{text}')) throw new Error('missing-text');
    const url = new URL(template.replaceAll('{text}', encodeURIComponent(text))
        .replaceAll('{lang}', 'fr-FR'));
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('invalid-url');
    return url.href;
}

function createExternalSpeech(onError) {
    let activeAudio = null;
    let loadTimer = null;

    function stop() {
        clearTimeout(loadTimer);
        if (!activeAudio) return;
        activeAudio.onerror = null;
        activeAudio.onplaying = null;
        activeAudio.onended = null;
        activeAudio.pause();
        activeAudio.removeAttribute('src');
        activeAudio.load();
        activeAudio = null;
    }

    function speak(template, text) {
        stop();
        let url;
        try {
            url = externalSpeechUrl(template, text);
        } catch {
            onError('configuration');
            return;
        }
        const audio = new Audio();
        activeAudio = audio;
        function fail(reason) {
            if (activeAudio !== audio) return;
            stop();
            onError(reason);
        }
        audio.onerror = () => fail('network');
        audio.onplaying = () => clearTimeout(loadTimer);
        audio.onended = () => { if (activeAudio === audio) stop(); };
        loadTimer = setTimeout(() => fail('network'), 15000);
        audio.src = url;
        try {
            audio.play().catch(error => fail(error.name === 'NotAllowedError' ? 'permission' : 'network'));
        } catch {
            fail('network');
        }
    }

    return { speak, stop };
}