const audtab = document.querySelector('.video-stream');
const spotTab = document.querySelector('.vnCew8qzJq3cVGlYFXRI')
const ssTab = document.querySelector('.sc-button-play.playButton.sc-button.sc-button-xlarge')
const ssTabAlt = document.querySelector('.playControl.sc-ir.playControls__control.playControls__play')
const ytmTab = document.querySelector('.ytmusic-app')
const ytmBTN = document.querySelector('ytmusic-play-button-renderer')
const altYTBTN = document.querySelector('tp-yt-paper-icon-button#play-pause-button.play-pause-button.style-scope.ytmusic-player-bar[title]')
const snaeone = document.querySelector('.-D.d.-K.-F.q.Bb')
const snaetwo = document.querySelector('.-q.-u.-Y.da.-m.ha.Qc')
function timeToSeconds(timeStr) {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes * 60) + seconds;
}
console.log('Media Interations Injected')
setInterval(() => {
    if (ytmTab) {
        console.log('YTM')
        const nex = document.querySelector('tp-yt-paper-icon-button.next-button.style-scope.ytmusic-player-bar[title="Next"][aria-label="Next"]')
        const bac = document.querySelector('tp-yt-paper-icon-button.previous-button.style-scope.ytmusic-player-bar[title="Previous"][aria-label="Previous"]')
        const pic = document.querySelector('.image.style-scope.ytmusic-player-bar').src
        const timeInfo = document.querySelector('span.time-info.style-scope.ytmusic-player-bar');
        const aname = document.querySelector('yt-formatted-string.byline.style-scope').innerHTML
        const cmf = document.querySelector('.title.style-scope.ytmusic-player-bar').innerHTML
        const timeInfoText = timeInfo.textContent.trim();
        const [currentTimeStr, totalTimeStr] = timeInfoText.split(' / ');
        const timeToSeconds = (timeStr) => {
            const [minutes, seconds] = timeStr.split(':').map(Number);
            return minutes * 60 + seconds;
        };
        const currTM = timeToSeconds(currentTimeStr);
        const endTM = timeToSeconds(totalTimeStr);
        ytmBTN.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            console.log('clicked')
            if (ext === false) {
                console.log('exec')
                window.parent.tb.mediaplayer.music({
                    track_name: cmf,
                    artist: aname,
                    background: pic,
                    time: currTM,
                    endtime: endTM,
                    onBack: () => {
                        bac.click()
                    },
                    onPausePlay: () => {
                        ytmBTN.click()
                    },
                    onNext: () => {
                        nex.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
        altYTBTN.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            console.log('clicked')
            if (ext === false) {
                console.log('exec')
                window.parent.tb.mediaplayer.music({
                    track_name: cmf,
                    artist: aname,
                    background: pic,
                    time: currTM,
                    endtime: endTM,
                    onBack: () => {
                        bac.click()
                    },
                    onPausePlay: () => {
                        altYTBTN.click()
                    },
                    onNext: () => {
                        nex.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    }
    if (ssTab) {
        console.log('SC')
        ssTab.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const imgElement = document.querySelector('span.sc-artwork');
                const imgStyle = imgElement.getAttribute('style');
                const regex = /url\(['"]?([^'"\)]+)['"]?\)/;
                const match = regex.exec(imgStyle);
                let img = null;
                if (match && match[1]) {
                    img = match[1];
                }
                console.log(img);
                const currTM = document.querySelector('.playbackTimeline__timePassed span[aria-hidden="true"]')
                const et = document.querySelector('.playbackTimeline__duration span[aria-hidden="true"]')
                const aname = document.querySelector('.playbackSoundBadge__lightLink.sc-link-light.sc-link-secondary.sc-truncate.sc-text-h5').getAttribute("title")
                const sname = document.querySelector('.playbackSoundBadge__titleLink.sc-truncate.sc-text-h5.sc-link-primary').getAttribute("title")
                const bk = document.querySelector('.skipControl.sc-ir.playControls__control.playControls__prev.skipControl__previous')
                const fw = document.querySelector('.skipControl.sc-irp.layControls__control.playControls__next.skipControl__next')
                const cmf = sname.length > 18 ? sname.slice(0, 18) + "..." : sname;
                const [currMinutes, currSeconds] = et.textContent.split(':').map(parseFloat);
                const durationInMs = currMinutes * 60 + currSeconds;
                const [cmin, ctmx] = currTM.textContent.split(':').map(parseFloat);
                const ctm = cmin * 60 + ctmx;
                window.parent.tb.mediaplayer.music({
                    track_name: cmf,
                    artist: aname,
                    background: img,
                    time: ctm,
                    endtime: durationInMs,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        ssTabAlt.click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    }
    if (ssTabAlt) {
        console.log('SC')
        ssTabAlt.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const imgElement = document.querySelector('span.sc-artwork');
                const imgStyle = imgElement.getAttribute('style');
                const regex = /url\(['"]?([^'"\)]+)['"]?\)/;
                const match = regex.exec(imgStyle);
                let img = null;
                if (match && match[1]) {
                    img = match[1];
                }
                console.log(img);
                const currTM = document.querySelector('.playbackTimeline__timePassed span[aria-hidden="true"]')
                const et = document.querySelector('.playbackTimeline__duration span[aria-hidden="true"]')
                const aname = document.querySelector('.playbackSoundBadge__lightLink.sc-link-light.sc-link-secondary.sc-truncate.sc-text-h5').getAttribute("title")
                const sname = document.querySelector('.playbackSoundBadge__titleLink.sc-truncate.sc-text-h5.sc-link-primary').getAttribute("title")
                const bk = document.querySelector('.skipControl.sc-ir.playControls__control.playControls__prev.skipControl__previous')
                const fw = document.querySelector('.skipControl.sc-irp.layControls__control.playControls__next.skipControl__next')
                const cmf = sname.length > 18 ? sname.slice(0, 18) + "..." : sname;
                const [currMinutes, currSeconds] = et.textContent.split(':').map(parseFloat);
                const durationInMs = currMinutes * 60 + currSeconds;
                const [cmin, ctmx] = currTM.textContent.split(':').map(parseFloat);
                const ctm = cmin * 60 + ctmx;
                window.parent.tb.mediaplayer.music({
                    track_name: cmf,
                    artist: aname,
                    background: img,
                    time: ctm,
                    endtime: durationInMs,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        ssTabAlt.click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    }
    if (spotTab) {
        console.log('Sporkify')
        spotTab.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const currTM = document.querySelector('.playback-bar__progress-time-elapsed')
                const t = document.querySelector('.kQqIrFPM5PjMWb5qUS56')
                const bk = document.querySelector('.fn72ari9aEmKo4JcwteT')
                const fw = document.querySelector('.mnipjT4SLDMgwiDCEnRC')
                const sname = document.querySelector('a[data-testid="context-item-link"]')
                const artist = document.querySelector('a[data-testid="context-item-info-artist"]')
                const bg = document.querySelector('.mMx2LUixlnN_Fu45JpFB')
                const [minutes, seconds] = t.split(':').map(parseFloat);
                const durationInMs = minutes * 60 + seconds
                console.log(durationInMs)
                window.parent.tb.mediaplauer.music({
                    track_name: sname,
                    artist: artist,
                    background: bg,
                    time: currTM,
                    endtime: durationInMs,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        spotTab.click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        });
    }
    if (audtab) {
        console.log('YT')
        const sr = async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const fav = document.querySelector('link[rel="icon"]')
                const endT = document.querySelector('.ytp-time-duration').innerHTML
                const [minutes, seconds] = endT.split(':').map(parseFloat);
                const durationInMs = minutes * 60 + seconds
                console.log(durationInMs)
                const vidName = document.querySelector('yt-formatted-string.style-scope.ytd-watch-metadata').innerHTML
                const creator = document.querySelector('a.yt-simple-endpoint.style-scope.yt-formatted-string').innerHTML
                window.parent.tb.mediaplayer.video({
                    video_name: vidName,
                    creator: creator,
                    background: fav.href,
                    endtime: durationInMs,
                    onPausePlay: () => {
                        const btn = document.querySelector('.ytp-play-button')
                        btn.click()
                    },
                    onNext: () => {
                        const btn = document.querySelector('.ytp-next-button')
                        btn.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        }
        audtab.addEventListener('play', sr);
        audtab.addEventListener('click', sr);
    }
    if (snaeone) {
        snaeone.querySelector('.na.F.Q.-a.-Y.oa.a.m.pa.Va').addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const sname = snaeone.querySelector('.I.T.-d').innerHTML
                const artist = "Snae Player"
                const bg = snaeone.querySelector('.fa.Na.Pa').style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                const background = bg ? bg[1] : null;
                const parentDiv = snaeone.querySelector('.-J.-F.-S.da.zb');
                const timeEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(1)');
                const currTM = timeEl ? timeToSeconds(timeEl.textContent) : null;
                const etEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(2)');
                const endTime = etEl ? timeToSeconds(etEl.textContent) : null;
                const fw = snaeone.querySelector('button[title="Play previous track (SHIFT+P)"]')
                const bk = snaeone.querySelector('button[title="Play next track (SHIFT+N)"]')
                window.parent.tb.mediaplayer.music({
                    track_name: sname,
                    artist: artist,
                    background: background,
                    time: currTM,
                    endtime: endTime,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        snaeone.querySelector('.na.F.Q.-a.-Y.oa.a.m.pa.Va').click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    }
    if (snaetwo) {
        console.log('timeless')
        snaetwo.querySelector('.na.F.Q.-a.-Y.oa.a.m.pa.Va').addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const sname = snaeone.querySelector('.C.N.Y').innerHTML
                const artist = "Snae Player"
                const bg = snaeone.querySelector('.fa.Na.Sc.Pa').style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                const background = bg ? bg[1] : null;
                const parentDiv = snaeone.querySelector('.-J.-F.-S.da.zb');
                const timeEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(1)');
                const currTM = timeEl ? timeToSeconds(timeEl.textContent) : null;
                const etEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(2)');
                const endTime = etEl ? timeToSeconds(etEl.textContent) : null;
                const fw = snaeone.querySelector('button[title="Play previous track (SHIFT+P)"]')
                const bk = snaeone.querySelector('button[title="Play next track (SHIFT+N)"]')
                window.parent.tb.mediaplayer.music({
                    track_name: sname,
                    artist: artist,
                    background: background,
                    time: currTM,
                    endtime: endTime,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        snaeone.querySelector('.na.F.Q.-a.-Y.oa.a.m.pa.Va').click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    }
    document.querySelectorAll('.na.-q.-t.va.-C.-J.-F.J.U.-e.y.Rb.Qb.Yb').forEach(element => {
        element.addEventListener('click', async () => {
            const ext = await window.parent.tb.mediaplayer.isExisting()
            if (ext === false) {
                const sname = snaeone.querySelector('.I.T.-d').innerHTML
                const artist = "Snae Player"
                const bg = snaeone.querySelector('.fa.Na.Pa').style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                const background = bg ? bg[1] : null;
                const parentDiv = snaeone.querySelector('.-J.-F.-S.da.zb');
                const timeEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(1)');
                const currTM = timeEl ? timeToSeconds(timeEl.textContent) : null;
                const etEl = parentDiv.querySelector('.H.S.-c.fa.Ab:nth-of-type(2)');
                const endTime = etEl ? timeToSeconds(etEl.textContent) : null;
                const fw = snaeone.querySelector('button[title="Play previous track (SHIFT+P)"]')
                const bk = snaeone.querySelector('button[title="Play next track (SHIFT+N)"]')
                window.parent.tb.mediaplayer.music({
                    track_name: sname,
                    artist: artist,
                    background: background,
                    time: currTM,
                    endtime: endTime,
                    onBack: () => {
                        bk.click()
                    },
                    onPausePlay: () => {
                        snaeone.querySelector('.na.F.Q.-a.-Y.oa.a.m.pa.Va').click()
                    },
                    onNext: () => {
                        fw.click()
                        window.parent.tb.mediaplayer.hide()
                    }
                });
            }
        })
    });
}, 1000)