const main = async () => {
    const so_lan_lien_tuc = 2

    // de phong mang lag
    const buffer_time_ms = 4000

    const reset_main = () => {
        setTimeout(main, buffer_time_ms)
    }

    const clear_shades = () => $('.layui-layer-shade').remove()

    const log_with_time = text => console.log(`${new Date().toLocaleTimeString()}: ${text}`)

    const bet = (he_so, dieu_kien) => {
        const bet__now = $("#bet__now")
        const btnsubmit__fastbet = $("#btnsubmit__fastbet")
        const so_tien = $('#amount__total')[0]
        dat_he_so(he_so)

        switch (dieu_kien) {
            case 'le_tat':
                le_tat()
                break
            case 'chan_tat':
                chan_tat()
                break
            default:
                chan_tat()
                break
        }

        log_with_time(`Ban vua cuoc 50 so voi so tien ${so_tien.innerHTML} VND, dang doi ket qua...`)
        bet__now.click()
        btnsubmit__fastbet.click()
    }

    const getRandomInt = (min = 2, max = 11) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }

    const random_bet = () => {
        document.querySelector(`#lottery__selector > div:nth-child(1) a:nth-child(${getRandomInt()})`).click()
        document.querySelector(`#lottery__selector > div:nth-child(2) a:nth-child(${getRandomInt()})`).click()
        bet__now.click()
        btnsubmit__fastbet.click()
    }

    const le_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='odd'").click()
    }

    const chan_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='even'").click()
    }

    const lay_ds_ket_qua = async () => {
        kq = await $.ajax({
            url: "/MobileService.aspx",
            dataType: "json",
            type: "POST",
            async: !1,
            data: {
                flag: "betrecord",
                id: 50
            }
        })
        return kq.reslist.slice(0, so_lan_lien_tuc)
    }

    const trung_de = async () => {
        const ds_kq = await lay_ds_ket_qua()
        const kq_cuoi = ds_kq[0]
        const dac_biet = kq_cuoi.winnumber.split(',')[0]
        log_with_time(`Ket qua cua luot xo ${kq_cuoi.bettime} la ${dac_biet}, ${kq_cuoi.statusname}`)
        return kq_cuoi.statusname === 'Trúng'
    }

    const dat_he_so = he_so => {
        $('#num__multiple input')[0].value = he_so
    }

    const le_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            bet(x, 'le_tat')

            setTimeout(async () => {
                if (await trung_de()) {
                    xxong()
                } else {
                    log_with_time(`Tiep tuc danh toan le voi he so ${x*2}`)
                    le_yolo(x*2, xxong)
                }
            }, buffer_time_ms)
        })
    }

    const chan_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            bet(x, 'chan_tat')

            setTimeout(async () => {
                if (await trung_de()) {
                    xxong()
                } else {
                    log_with_time(`Tiep tuc danh toan chan voi he so ${x*2}`)
                    chan_yolo(x*2, xxong)
                }
            }, buffer_time_ms)
        })
    }

    clear_shades()
    random_bet()
    const ds_kq = await lay_ds_ket_qua()
    const ket_qua_str = ds_kq.map(dm=>dm.winnumber.split(',')[0].slice(-2))
    const ket_qua_int = ket_qua_str.map(dm=>parseInt(dm))
    log_with_time(`Ket qua ${so_lan_lien_tuc} lan gan nhat la: ${ket_qua_str}`)
    const toan_chan = ket_qua_int.every(dm=>dm%2===0)
    const toan_le = ket_qua_int.every(dm=>dm%2!==0)

    if (toan_chan) {
        log_with_time(`${so_lan_lien_tuc} dau chan lien tuc, bat dau cuoc le...`)
        await le_yolo(2)
        log_with_time(`An roi, nghi chut da, tiep tuc choi sau ${buffer_time_ms/1000} giay...`)
        reset_main()
    } else if (toan_le) {
        log_with_time(`${so_lan_lien_tuc} dau le lien tuc, bat dau cuoc chan...`)
        await chan_yolo(2)
        log_with_time(`An roi, nghi chut da, tiep tuc choi sau ${buffer_time_ms/1000} giay...`)
        reset_main()
    } else {
        log_with_time(`${so_lan_lien_tuc} dau khong lien tuc, cho luot xo tiep theo...`)
        reset_main()
    }
}

// start
main()