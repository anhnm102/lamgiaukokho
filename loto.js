const main = async () => {
    const so_lan_lien_tuc = 4
    const thoi_gian_1_luot_xo = 45

    // de phong mang lag
    const buffer_time_ms = 5000

    const time_remain_ms = () => parseInt($(".time__count.timeCountBet")[0].innerHTML.slice(-2)) * 1000
    const time_remain_with_buffer_ms = () => time_remain_ms() + buffer_time_ms
    const reset_time_with_buffer_ms = () => thoi_gian_1_luot_xo * 1000 + buffer_time_ms

    const reset_main = delay_time_ms => {
        setTimeout(main, delay_time_ms)
    }

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

    const le_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='odd'").click()
    }

    const chan_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='even'").click()
    }

    const lay_ds_ket_qua = () => {
        return $.ajax({
            url: "/UserService.aspx",
            dataType: "json",
            type: "POST",
            async: !1,
            data: {
                flag: "UIWinOpenNumberBean",
                id: 100,
                num: so_lan_lien_tuc
            }
        })
    }

    const lay_kq_cuoi_cung = async () => {
        const ds_kq = await lay_ds_ket_qua()
        const kq_cuoi = ds_kq.reslist[0]
        log_with_time(`Ket qua cua luot xo ${kq_cuoi.timebet.slice(9)} la ${kq_cuoi.dacbiet}`)
        return parseInt(kq_cuoi.dacbiet.slice(-2))
    }

    const kq_cuoi_la_so_chan = async () => {
        const kq_cuoi = await lay_kq_cuoi_cung()
        return kq_cuoi % 2 === 0
    }

    const kq_cuoi_la_so_le = async () => {
        const kq_cuoi = await lay_kq_cuoi_cung()
        return kq_cuoi % 2 !== 0
    }

    const dat_he_so = he_so => {
        $('#num__multiple input')[0].value = he_so
    }

    const le_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            bet(x, 'le_tat')

            setTimeout(async () => {
                if (await kq_cuoi_la_so_chan()) {
                    log_with_time(`Tiep tuc danh toan le voi he so ${x*2}`)
                    le_yolo(x*2, xxong)
                } else {
                    xxong()
                }
            }, time_remain_with_buffer_ms())
        })
    }

    const chan_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            bet(x, 'chan_tat')

            setTimeout(async () => {
                if (await kq_cuoi_la_so_le()) {
                    log_with_time(`Tiep tuc danh toan chan voi he so ${x*2}`)
                    chan_yolo(x*2, xxong)
                } else {
                    xxong()
                }
            }, time_remain_with_buffer_ms())
        })
    }


    const ds_kq = await lay_ds_ket_qua()
    const ket_qua_str = ds_kq.reslist.map(dm=>dm.dacbiet.slice(-2))
    const ket_qua_int = ket_qua_str.map(dm=>parseInt(dm))
    log_with_time(`Ket qua ${so_lan_lien_tuc} lan gan nhat la: ${ket_qua_str}`)
    const toan_chan = ket_qua_int.every(dm=>dm%2===0)
    const toan_le = ket_qua_int.every(dm=>dm%2!==0)

    if (toan_chan) {
        log_with_time(`${so_lan_lien_tuc} dau chan lien tuc, bat dau cuoc le...`)
        await le_yolo(1)
        log_with_time(`An roi, nghi chut da, tiep tuc choi sau ${so_lan_lien_tuc} luot xo nua...`)
        reset_main(time_remain_with_buffer_ms() + reset_time_with_buffer_ms()*(so_lan_lien_tuc-1))
    } else if (toan_le) {
        log_with_time(`${so_lan_lien_tuc} dau le lien tuc, bat dau cuoc chan...`)
        await chan_yolo(1)
        log_with_time(`An roi, nghi chut da, tiep tuc choi sau ${so_lan_lien_tuc} luot xo nua...`)
        reset_main(time_remain_with_buffer_ms() + reset_time_with_buffer_ms()*(so_lan_lien_tuc-1))
    } else {
        log_with_time(`${so_lan_lien_tuc} dau khong lien tuc, cho luot xo tiep theo...`)
        reset_main(time_remain_with_buffer_ms())
    }
}

// start
main()