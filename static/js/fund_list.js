(()=>{
    let GW = window.fund_list = {
        init:()=> {
            GW.search_data();
            $("#btn_search").on("click", function() {
                GW.search_data();
            });
            $("#tbody_fund_list").on("click", "[event=delete]", function() {
                const fund_code = $(this).closest("tr").find("[val=fund_code]").text().trim();
                GW.delete_fund(fund_code);
            });

            $("#text_main_title, #text_manager, #text_fund_code0name").on("keypress", (event)=> {
                if(event.keyCode == 13) {
                    GW.search_data();
                    return false;
                }
            });
        },
        search_data:(page)=> {
            page = page ? page : 1;
            let req_data = {
                "page": page,
                "manager": $("#text_manager").val() || "",
                "fund_code0name": $("#text_fund_code0name").val() || "",
            }
            common.api_post({
                url: "/api/fund_list",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        let html_list = [];
                        for (let i=0; i<res.data.length; i++ ) {
                            let item = res.data[i];
                            let raw_html = $("#st_tr").html().trim();
                            raw_html = raw_html.replace(/{{_id}}/g, item._id || "");
                            raw_html = raw_html.replace(/{{fund_code}}/g, item.fund_code || "");
                            raw_html = raw_html.replace(/{{fund_name}}/g, item.fund_name || "");
                            raw_html = raw_html.replace(/{{fund_create_date}}/g, item.fund_create_date || "");
                            let $html_tr = $(raw_html);
                            html_list.push($html_tr);
                        }
                        $("#tbody_fund_list").empty().append(html_list);
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
        delete_fund:(fund_code)=> {
            let req_data = {
                "fund_code": fund_code,
            }
            common.api_post({
                url: "/api/fund_delete",
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
