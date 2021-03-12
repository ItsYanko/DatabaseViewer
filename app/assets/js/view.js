let base = "http://localhost:3090/api"
let perPage = 5;
let data = {
    tables: false,
    table: { // Current table
        index: 0, // Index of TABLES
        count: 0,
        current: 0,
        fields: []
    },
    page: 0
}

$(window).ready(async () => {
    try {
        const res = await $.get(`${base}/list`).promise();
        if (res.error)
            return error(res.message || "Erro desconhecido ao obter dados");

        data.tables = res.data;
        $("#tables").html(data.tables.map(t => `<option value="${data.tables.indexOf(t)}">${t}</option>`));

        await table.set(0); // Select 1st table

        $("body").attr("loaded", '')
        $("#tables").on('change', e => table.set(e.currentTarget.value))
        $(".control").on('click', e => {
            var newC = -1;
            switch (e.currentTarget.dataset.btn) {
                case '0': {
                    newC = 0;
                    break;
                }

                case '1': {
                    newC = (data.table.current - 1 < 0) ? data.table.current : data.table.current - 1;
                    break;
                }

                case '2': {
                    newC = (data.table.current + 1 >= data.table.count) ? data.table.current : data.table.current + 1;
                    break;
                }

                case '3': {
                    newC = data.table.count - 1;
                    break;
                }
            }

            if (newC != data.table.current) {
                table.loadPage(newC);
            }
        })
    } catch (e) {
        error("Erro ao obter dados iniciais", e)
    }
})

const table = {
    set: async function (table = 0) {
        $("#tables").val(table);
        _cl(true);

        try {
            let res = await $.get(`${base}/info`, { table: data.tables[table] }).promise();
            if (res.error)
                return error(res.message || "Erro desconhecido ao obter dados da tabela");

            data.table.index = table;
            data.table.fields = res.fields;
            data.table.count = res.count;
            await this.loadPage(0);
        } catch (e) {
            return error("Erro ao obter dados da tabela", e);
        }
        _cl(false);
    },

    loadPage: async function (page = 0) {
        try {
            let res = await $.get(`${base}/data`, { table: data.tables[data.table.index], index: page, }).promise();
            if (res.error)
                return error(res.message || "Erro desconhecido ao obter registo da tabela");

            $(".form").html(
                res.data.map(t =>
                    `<div class="form-elm"><div>${data.table.fields[res.data.indexOf(t)]}</div><input type="text" value="${(Number.isNaN(new Date(t).getDate()) || new Date(t).getFullYear() <= 1970) ? t : new Date(t).toLocaleString()}" readonly></div>`
                )
            );

            data.table.current = page;
            table.nav()
        } catch (e) {
            return error("Erro ao obter registo da tabela", e);
        }
    },

    nav: () => {
        let status = [false, false, false, false];
        if (data.table.current <= 0) {
            status[0] = true;
            status[1] = true;
        }

        if (data.table.current >= data.table.count - 1) {
            status[2] = true;
            status[3] = true;
        }

        $(".control").each((i, e) => $(e).attr("dis", status[e.dataset.btn]))
    }
}

function _cl(s = true) { // Content loader UI component
    $("body").get(0).style.setProperty("--content-loading", (s) ? "" : "false");
}


function error(message, extra = false) {
    if (extra)
        console.error(extra);

    alert(message)
}