(()=> {
    // fund_worth_chart.cache_fund_growth
    let GW = window.fund_worth_chart = {
        init:()=> {
            if($("#cxb_drop_base_1").is(":checked")) {
                GW.drop_base_1 = parseFloat($("#drop_base_1").val());  /* 0.00 or 1.00 */
            } else {
                GW.drop_base_1 = 0.00;
            }
            GW.cache_fund_growth = {
                "_date_": [],
            }
            let fund_code = new URLSearchParams(window.location.search).get("fund_code");

            $("#fund_select").on("select2:select", (e)=> {
                // https://select2.org/programmatic-control/events
                GW.query_fund_growth(e.params.data.id, ()=> {
                    GW.add_trace_fund_growth(e.params.data.id);
                });
            });
            $("#fund_select").on("select2:unselect", (e)=> {
                GW.remove_chart_line(e.params.data.id);
            });
            $("#btn_apply").on("click", (e)=> {
                GW.cache_fund_growth["_date_"] = common.get_date_range($("#date_start").val(), $("#date_end").val());
                GW.submit_apply_trace();
            });
            GW.layout = {
                "xaxis": {
                    "spikethickness": 2,
                    "spikesnap": "cursor",
                    "showspikes": true,
                    "spikemode": "across",
                },
                "yaxis": {
                    "spikethickness": 2,
                    "spikesnap": "cursor",
                    "showspikes": true,
                    "spikemode": "across",
                },
            }
            Plotly.newPlot("fund_worth_compare_chart", [], GW.layout);

            GW.init_fund_list(()=>{
                $("#fund_select>option[value=" + fund_code + "]").prop("selected", true);
                $("#fund_select").trigger("change");
            });
            GW.search_data(fund_code, ()=> {
                GW.query_fund_growth(fund_code, ()=> {
                    GW.add_trace_fund_growth(fund_code);
                });
            });
        },
        search_data:(fund_code, callback)=> {
            let req_data = {
                "fund_code": fund_code,
            }
            common.api_post({
                url: "/api/fund_worth_whole_data",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {

                        let remap = {};
                        for (let i = 0; i < res.data.map.length; i++ ) {
                            remap[res.data.map[i]] = i;
                        }

                        let t_bonus = {
                            name: "bonus",
                            x: [],
                            y: [],
                            mode: "markers",
                            opacity: 1,
                            marker: {
                                color: "#dc3545",
                                size: 6,
                            },
                        }
                        let t_worth = {
                            name: "worth",
                            x: [],
                            y: [],
                            type: "scatter",
                            line: {
                                color: "#bbb",
                            },
                        }

                        let t_cum_worth = {
                            name: "cum_worth",
                            x: [],
                            y: [],
                            type: "scatter",
                            fill: "tonexty",
                            fillcolor: "#ddd",
                            line: {
                                color: "#bbb",
                            },
                        }
                        let t_growth = {
                            name: "growth",
                            x: [],
                            y: [],
                        }
                        let t_cum_growth = {
                            name: "cum_growth",
                            x: [],
                            y: [],
                            line: {
                                color: "#dc3545",
                            },
                        }
                        let base_date_list = {
                            x: [],
                            y: [],
                        }

                        $("#date_start").val(res.data.list[0][0]);
                        $("#date_end").val(res.data.list[res.data.list.length - 1][0]);
                        let date_list = common.get_date_range($("#date_start").val(), $("#date_end").val());
                        // base_date_list["x"] = date_list;
                        GW.cache_fund_growth["_date_"] = date_list;

                        let d = 0;
                        let idata = remap["date"],
                            iworth = remap["worth"],
                            igrowth = remap["growth"],
                            icum_worth = remap["cum_worth"];

                        for (let i = 0; i < res.data.list.length; i++ ) {
                            let item = res.data.list[i];
                            if(item[idata] < date_list[0] || date_list[date_list.length - 1] < item[idata]) {
                                continue;
                            }
                            for(; d < date_list.length; d++ ) {
                                if(item[idata] <= date_list[d]) {
                                    d = d + 1;
                                    break;
                                }
                                t_worth["y"].push(t_worth["y"][d - 1]);
                                t_growth["y"].push(0.0);
                                t_cum_worth["y"].push(t_cum_worth["y"][d - 1]);
                                t_cum_growth["y"].push(t_cum_growth["y"][d - 1]);
                            }
                            t_worth["y"].push(item[iworth] - GW.drop_base_1);
                            t_growth["y"].push(item[igrowth] - GW.drop_base_1);
                            t_cum_worth["y"].push(item[icum_worth] - GW.drop_base_1);
                            if (i == 0) {
                                t_cum_growth["y"].push(1 - GW.drop_base_1);
                            } else {
                                t_cum_growth["y"].push((t_cum_growth["y"][t_cum_growth["y"].length - 1] + GW.drop_base_1) * (1 + item[igrowth] / 100) - GW.drop_base_1);
                            }
                        }

                        t_worth["x"] = date_list;
                        t_cum_worth["x"] = date_list;
                        t_growth["x"] = date_list;
                        t_cum_growth["x"] = date_list;

                        for (let i = 0; i < res.data.bonus_list.length; i++ ) {
                            let item = res.data.bonus_list[i];
                            t_bonus["x"].push(item["date"]);
                            t_bonus["y"].push(item["bonus"]);
                        }

                        t_cum_worth["x"] = t_worth["x"];
                        t_growth["x"] = t_worth["x"];
                        t_cum_growth["x"] = t_worth["x"];

                        let data = [t_worth, t_cum_worth, t_cum_growth, t_bonus];
                        Plotly.newPlot("fund_worth_chart", data, GW.layout);

                        if(callback) {
                            callback();
                        }

                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
        fill_detail_chart:()=> {
            ;
        },
        remove_chart_line:(fund_code)=> {
            let chart_name_list = fund_worth_compare_chart.data.map((e)=>{ return e.name; });
            let line_id = chart_name_list.indexOf(fund_code);
            if (line_id !== -1) {
                Plotly.deleteTraces("fund_worth_compare_chart", line_id);
            }
        },
        init_fund_list:(callback)=> {
            common.api_post({
                url: "/api/fund_worth_list_fund",
                data: {},
                success: (res)=> {
                    console.log(res);
                    if (res.code == 0) {
                        let opt_list = [];
                        for (let i = 0 ; i < res.data.fund_code_list.length ; i++ ) {
                            let fund_code = res.data.fund_code_list[i];
                            let fund = res.data.fund[fund_code];
                            let fund_name = fund ? fund.fund_name : "--";
                            opt_list.push("<option value=\"" + fund_code + "\" >" + fund_name + " (" + fund_code + ")</option>");
                        }
                        $("#fund_select").empty().append(opt_list);
                        $("#fund_select").select2({
                            "placeholder": "（可以多选）",
                        });
                        if(callback) {
                            callback();
                        }
                    } else {
                        $.notify("初始化基金列表失败: " + res.desc, "error");
                    }
                },
            });
        },
        query_fund_growth:(fund_code, callback)=> {
            if(!!GW.cache_fund_growth[fund_code]) {
                if (!!callback) {
                    callback(fund_code);
                }
            }
            let req_data = {
                "fund_code": fund_code,
            }
            common.api_post({
                url: "/api/fund_worth_whole_growth",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if (res.code == 0) {
                        GW.cache_fund(fund_code, res.data.list);
                        if (!!callback) {
                            callback(fund_code);
                        }
                    } else {
                        $.notify("查询基金净值失败: " + res.desc, "error");
                    }
                },
            });
        },
        cache_fund:(fund_code, data_list)=> {
            let plot_data = {
                "date": [],
                "growth": [],
                // "cum_growth": [],
            }
            for (let i = 0; i < data_list.length; i++ ) {
                let item = data_list[i];
                plot_data["date"].push(item[0]);
                plot_data["growth"].push(item[1]);
                // if (i == 0 ) {
                //     plot_data["cum_growth"].push(1 - GW.drop_base_1);
                // } else {
                //     plot_data["cum_growth"].push((plot_data["cum_growth"][i - 1] + GW.drop_base_1) * (1 + plot_data["growth"][i] / 100) - GW.drop_base_1);
                // }
            }
            GW.cache_fund_growth[fund_code] = plot_data;
        },
        add_trace_fund_growth:(fund_code)=> {

            let chart_name_list = fund_worth_compare_chart.data.map((e)=>{ return e.name; });
            let line_id = chart_name_list.indexOf(fund_code);
            if (line_id !== -1) {
                return false;
            }
            let fund_date_list = GW.cache_fund_growth[fund_code]["date"];
            let fund_growth_list = GW.cache_fund_growth[fund_code]["growth"];

            let min_date = (fund_date_list[0] < GW.cache_fund_growth["_date_"][0]) ? GW.cache_fund_growth["_date_"][0] : fund_date_list[0];
            let max_date = (fund_date_list[fund_date_list.length - 1] > GW.cache_fund_growth["_date_"][GW.cache_fund_growth["_date_"].length - 1]) ? GW.cache_fund_growth["_date_"][GW.cache_fund_growth["_date_"].length - 1] : fund_date_list[fund_date_list.length - 1];
            let target_date_list = common.get_date_range(min_date, max_date);

            fund_date_list = fund_date_list.filter((e)=> {
                return min_date <= e && e <= max_date;
            });

            fund_growth_list = GW.cache_fund_growth[fund_code]["growth"].slice(
                GW.cache_fund_growth[fund_code]["date"].indexOf(fund_date_list[0]),
                GW.cache_fund_growth[fund_code]["date"].indexOf(fund_date_list[fund_date_list.length - 1]) + 1,
            );
            let ifd = 0;
            let cum_growth = [];

            for (var i = 0; i < target_date_list.length; i++) {
                let p_date = target_date_list[i];
                if(p_date < fund_date_list[0]) {
                    continue;
                }
                if (fund_date_list[fund_date_list.length - 1] < p_date) {
                    continue;
                }

                while(ifd < fund_date_list.length) {
                    if (p_date == fund_date_list[ifd]) {
                        if(cum_growth.length == 0) {
                            cum_growth.push(1 - GW.drop_base_1);
                        } else {
                            cum_growth.push((cum_growth[cum_growth.length - 1] + GW.drop_base_1) * (1 + fund_growth_list[ifd] / 100) - GW.drop_base_1);
                        }
                        ifd = ifd + 1;
                        break;
                    } else if (p_date < fund_date_list[ifd]) {
                        if(cum_growth.length == 0) {
                            cum_growth.push(1 - GW.drop_base_1);
                        } else {
                            cum_growth.push(cum_growth[cum_growth.length - 1]);
                        }
                        break;
                    } else {
                        $.notify("Not happenning", "error");
                    }
                }
            }

            Plotly.addTraces("fund_worth_compare_chart", {
                name: fund_code,
                x: target_date_list,
                y: cum_growth,
            });
        },
        submit_apply_trace:()=> {

            if($("#cxb_drop_base_1").is(":checked")) {
                GW.drop_base_1 = parseFloat($("#drop_base_1").val());  /* 0.00 or 1.00 */
            } else {
                GW.drop_base_1 = 0.00;
            }

            let chart_name_list = fund_worth_compare_chart.data.map((e)=>{ return e.name; });
            for (var i = 0; i < chart_name_list.length; i++) {
                Plotly.deleteTraces("fund_worth_compare_chart", 0);
            }
            for(let i=0; i<chart_name_list.length; i++ ) {
                let fund_code = chart_name_list[i];
                GW.add_trace_fund_growth(fund_code);
            }
        },
    }
})();
