const main = async () => {
    var time_remain = () => parseInt($(".time__count.timeCountBet")[0].innerHTML.slice(-2))

    var bet = () => {
        const bet__now = $("#bet__now")
        const btnsubmit__fastbet = $("#btnsubmit__fastbet")
        bet__now.click()
        btnsubmit__fastbet.click()
    }

    var le_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='odd'").click()
    }

    var chan_tat = () => {
        $("#lottery__selector > div:nth-child(1) a[name='all'").click()
        $("#lottery__selector > div:nth-child(2) a[name='even'").click()
    }

    var lay_ds_ket_qua = () => {
        return $.ajax({
            url: "/UserService.aspx",
            dataType: "json",
            type: "POST",
            async: !1,
            data: {
                flag: "UIWinOpenNumberBean",
                id: 100,
                num: 4
            }
        })
    }

    var le_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            $('#num__multiple input')[0].value = x
            le_tat()
            bet()

            setTimeout(async () => {
                const ds_kq = await lay_ds_ket_qua()
                const kq_cuoi = parseInt(ds_kq.reslist[0].dacbiet.slice(-2))
                if (kq_cuoi % 2 === 0) {
                    le_yolo(x*2, xxong)
                } else {
                    xxong()
                }
            }, time_remain() + 5000)
        })
    }

    var chan_yolo = async (x, xong) => {
        return new Promise(async xxong => {
            if (xong) xxong = xong
            $('#num__multiple input')[0].value = x
            chan_tat()
            bet()

            setTimeout(async () => {
                const ds_kq = await lay_ds_ket_qua()
                const kq_cuoi = parseInt(ds_kq.reslist[0].dacbiet.slice(-2))
                if (kq_cuoi % 2 !== 0) {
                    chan_yolo(x*2, xxong)
                } else {
                    xxong()
                }
            }, time_remain() + 5000)
        })
    }


    const ds_kq = await lay_ds_ket_qua()
    const ket_qua = ds_kq.reslist.map(dm=>parseInt(dm.dacbiet.slice(-2)))
    console.log(`ket qua 4 lan gan nhat la: ${ket_qua}`)
    const toan_chan = ket_qua.every(dm=>dm%2===0)
    const toan_le = ket_qua.every(dm=>dm%2!==0)

    if (toan_chan) {
        console.log(`4 dau chan lien tuc, bat dau cuoc le...`)
        await le_yolo(1)
        setTimeout(() => main(), 180000)
    } else if (toan_le) {
        console.log(`4 dau le lien tuc, bat dau cuoc chan...`)
        await chan_yolo(1)
        setTimeout(() => main(), 180000)
    } else {
        console.log(`4 dau khong lien tuc, cho ket qua tiep theo...`)
        setTimeout(() => main(), 50000)
    }
}

// start
main()