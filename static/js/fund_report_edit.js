(()=>{
    let GW = window.fund_report_edit = {
        init:()=> {
            $("#btn_modify").on("click", function() {
                GW.edit_data();
            });
            GW.query_data();
        },
        query_data:()=> {
            let fund_report_id = new URLSearchParams(window.location.search).get("fund_report_id");
            let req_data = {
                "fund_report_id": fund_report_id,
            }
            common.api_post({
                url: "/api/fund_report_query",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        $("#_id").val(res.data._id);
                        $("#text_fund_code").val(res.data.fund_code);
                        $("#text_manager").val(res.data.manager);
                        $("#text_main_title").val(res.data.main_title);
                        $("#text_fund_worth").val(res.data.fund_worth);
                        $("#text_report_date_start").val(res.data.report_date_start);
                        $("#text_report_date").val(res.data.report_date);
                        $("#text_grow_rate1").val(res.data.grow_rate1);
                        $("#text_grow_rate2").val(res.data.grow_rate2);
                        $("#text_fund_asset").val(res.data.fund_asset);
                        $("#text_fund_count").val(res.data.fund_count);
                        $("#text_pdf_store_path").val(res.data.pdf_store_path);
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
        edit_data:()=> {
            let req_data = {
                "_id": $("#_id").val().trim(),
                "fund_code": $("#text_fund_code").val().trim(),
                "manager": $("#text_manager").val().trim(),
                "main_title": $("#text_main_title").val().trim(),
                "fund_worth": $("#text_fund_worth").val().trim(),
                "report_date_start": $("#text_report_date_start").val().trim(),
                "report_date": $("#text_report_date").val().trim(),
                "grow_rate1": $("#text_grow_rate1").val().trim(),
                "grow_rate2": $("#text_grow_rate2").val().trim(),
                "fund_asset": $("#text_fund_asset").val().trim(),
                "fund_count": $("#text_fund_count").val().trim(),
                "pdf_store_path": $("#text_pdf_store_path").val().trim(),
            }
            common.api_post({
                url: "/api/fund_report_edit",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        $.notify("更新成功", "success");
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
    }
})();
