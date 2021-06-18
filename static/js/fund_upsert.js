(()=>{
    let GW = window.fund_upsert = {
        init:()=> {
            $("#btn_create, #btn_modify").on("click", function() {
                GW.upsert_data();
            });

            let fund_code = new URLSearchParams(window.location.search).get("fund_code");
            if (!fund_code) {
                $("#btn_create").removeClass("d-none");
            } else {
                $("#btn_modify").removeClass("d-none");
                GW.query_data(fund_code);
            }
        },
        query_data:(fund_code)=> {
            let req_data = {
                "fund_code": fund_code,
            }
            common.api_post({
                url: "/api/fund_query",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        $("#_id").val(res.data._id);
                        $("#text_fund_code").val(res.data.fund_code);
                        $("#text_fund_company").val(res.data.fund_company);
                        $("#text_fund_name").val(res.data.fund_name);
                        $("#text_fund_count").val(res.data.fund_count);
                        $("#text_fund_short_name").val(res.data.fund_short_name);
                        $("#text_fund_type").val(res.data.fund_type);
                        $("#text_fund_create_date").val(res.data.fund_create_date);
                        $("#text_fund_whole_name").val(res.data.fund_whole_name);
                        $("#text_manager").val(res.data.manager);
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
        upsert_data:()=> {
            let req_data = {
                "_id": $("#_id").val().trim() || null,
                "fund_code": $("#text_fund_code").val().trim(),
                "fund_company": $("#text_fund_company").val().trim(),
                "fund_name": $("#text_fund_name").val().trim(),
                "fund_count": $("#text_fund_count").val().trim(),
                "fund_short_name": $("#text_fund_short_name").val().trim(),
                "fund_type": $("#text_fund_type").val().trim(),
                "fund_create_date": $("#text_fund_create_date").val().trim(),
                "fund_whole_name": $("#text_fund_whole_name").val().trim(),
                "manager": $("#text_manager").val().trim(),
            }
            common.api_post({
                url: "/api/fund_upsert",
                data: req_data,
                success: (res)=> {
                    console.log(res);
                    if(res.code == 0) {
                        if (!!req_data["_id"]) {
                            $.notify("更新成功", "success");
                        } else {
                            $.notify("创建成功", "success");
                            window.location.search = "?fund_code=" + res.data._id;
                        }
                    } else {
                        $.notify(res.desc, "error");
                    }
                },
            });
        },
    }
})();
