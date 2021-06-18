(()=>{
    let GW = window.fund_report_list = {
        init:()=> {
            $("#btn_search").on("click", function() {
                GW.search_data();
            });
            $("#tbody_fund_report_list").on("click", "[event=delete]", function() {
                const fund_report_id = $(this).closest("tr").find("[val=fund_report_id]").text().trim();
                GW.delete_fund_report(fund_report_id);
            });
            $("#text_main_title, #text_manager, #text_fund_code0name").on("keypress", (event)=> {
                if(event.keyCode == 13) {
                    GW.search_data();
                    return false;
                }
            });
            GW.search_data();
        },
        search_data:(page)=> {
            page = page ? page : 1;
            let req_data = {
                "page": page,
                "main_title": $("#text_main_title").val() || "",
                "manager": $("#text_manager").val() || "",
                "fund_code0name": $("#text_fund_code0name").val() || "",
            }
            common.api_post({
                url: "/api/fund_report_list",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        let html_list = [];
                        for (let i = 0; i < res.data.length; i++ ) {
                            let item = res.data[i];
                            let raw_html = $("#st_tr").html().trim();
                            raw_html = raw_html.replace(/{{fund_code}}/g, item.fund_code || "");
                            raw_html = raw_html.replace(/{{fund_name}}/g, item.fund_name || "");
                            raw_html = raw_html.replace(/{{price}}/g, item.price || "");
                            raw_html = raw_html.replace(/{{report_date}}/g, item.report_date || "");
                            raw_html = raw_html.replace(/{{fund_worth}}/g, item.fund_worth || "");
                            raw_html = raw_html.replace(/{{main_title}}/g, item.main_title || "");
                            raw_html = raw_html.replace(/{{fund_asset}}/g, item.fund_asset || "-");
                            raw_html = raw_html.replace(/{{fund_count}}/g, item.fund_count || "-");
                            raw_html = raw_html.replace(/{{grow_rate1}}/g, item.grow_rate1 || "-");
                            raw_html = raw_html.replace(/{{grow_rate2}}/g, item.grow_rate2 || "-");
                            raw_html = raw_html.replace(/{{report_date_start}}/g, item.report_date_start || "");
                            raw_html = raw_html.replace(/{{fund_report_id}}/g, item._id || "");
                            let $html_tr = $(raw_html);
                            html_list.push($html_tr);
                        }
                        $("#tbody_fund_report_list").empty().append(html_list);
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
        delete_fund_report:(fund_report_id)=> {
            let req_data = {
                "_id": fund_report_id,
            }
            common.api_post({
                url: "/api/fund_report_delete",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        $.notify("删除成功", "success");
                        GW.search_data();
                    } else {
                        $.notify("删除失败：" + res.desc, "error");
                    }
                },
            });
        },
    }
})();
