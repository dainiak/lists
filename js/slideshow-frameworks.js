$(function () {
    let l10nAll = {
        'en': {
            'col-demo': 'Demo',
            'col-desc': 'Description',
            'col-lastupdate': 'Updated',
            'col-name': 'Framework',
            'col-rating': 'Rating',
            'col-src': 'Source',
            'contributor-credits': 'The list benefited much from the contributions by ',
            'github-link': 'Contribute on GitHub',
            'kathy-sierra-quote': '…since I’m a software developer, I’ll think of the audience as my users. And if they’re my users, then this presentation is a user experience. And if it’s a user experience, then what am I? … I am just a UI … nothing more. And what’s a key attribute of a good UI? It disappears. It does not draw attention to itself. It enables the user experience, but is not itself the experience.',
            'maintained-by': 'This list is maintained by <a href="https://www.dainiak.com" rel="author">Alex Dainiak</a> and contributors.',
            'nothing-found': 'No matching records found',
            'powered-by': 'This webpage is powered by',
            'search-field': 'Search',
            'search-field-placeholder': 'start typing here...',
            'title': 'HTML/CSS/JS Presentation Frameworks',
        }, 'ru': {
            'col-demo': 'Демо',
            'col-desc': 'Описание',
            'col-lastupdate': 'Обновление',
            'col-name': 'Движок',
            'col-rating': 'Рейтинг',
            'col-src': 'Исходники',
            'contributor-credits': 'Большую помощь в пополнении списка и описаний оказали ',
            'github-link': 'Есть дополнения?',
            'kathy-sierra-quote': '… я разработчик, поэтому представляю свою аудиторию <em>пользователями</em>. А раз они мои пользователи, то <em>моя презентация — их пользовательский опыт</em>. А раз это пользовательский опыт, то кто я такая? … Я интерфейс … не более. А что главное в хорошем интерфейсе? То, что он «прозрачен». Он не перетягивает внимание на себя. Он позволяет пользователю <em>получить опыт взаимодействия</em>, но сам по себе этим <em>опытом не является</em>.',
            'maintained-by': 'Список скомпилирован и поддерживается <a href="https://www.dainiak.com" rel="author">Александром Дайняком</a> и соучастниками.',
            'nothing-found': 'По запросу ничего не найдено',
            'powered-by': 'На странице использованы библиотеки ',
            'search-field': 'Поиск',
            'search-field-placeholder': 'начните вводить запрос',
            'title': 'HTML/CSS/JS-движки для создания презентаций',
        }
    };

    function getCurrentLanguage() {
        if (window.location.hash === '#ru') return 'ru';
        if (window.location.hash === '#en') return 'en';
        return navigator.languages.includes('ru') ? 'ru' : 'en';
    }

    function localize(language) {
        const l10n = l10nAll[language];
        document.title = l10n['title'];
        ['name', 'demo', 'src', 'lastupdate', 'desc', 'rating'].forEach(col => $(`th.${col}`).text(l10n[`col-${col}`]));
        Object.entries(l10n).forEach(([key, value]) => $(`.${key}`).html(value));
        $('#searchField').attr('placeholder', l10n['search-field-placeholder']);
    }

    function getColumnDefs() {
        return [
            {
                targets: [0, 1, 2, 3, 4], orderable: true
            }, {
                targets: 5, orderable: false
            }, {
            targets: 'src', type: 'ispresent', render: (data) => {
                if (!data)
                    return '<i class="fa fa-times" aria-hidden="true"></i>';
                const icon = data.match(/github\./) ? 'fa-brands fa-github' : 'fa-solid fa-code';
                return `<a class="btn btn-outline-secondary print-hide" href="${data}"><i class="${icon}" aria-hidden="true"></i></a><a class="print-only" href="${data}">${data}</a>`;
            }
        }, {
            targets: 'demo',
            type: 'ispresent',
            render: (data) => data
                ? `<a class="btn btn-outline-secondary print-hide" href="${data}"><i class="fa fa-television" aria-hidden="true"></i></a><a class="print-only" href="${data}">${data}</a>`
                : '<i class="fa fa-times" aria-hidden="true"></i>'
        }, {
            targets: 'rating',
            type: 'rating',
            render: (data) => data ? '<i class="fa fa-star" aria-hidden="true"></i>'.repeat(parseInt(data)) : ''
        }]
    }

    function setupEventHandlers() {
        $('img[data-language]').click(e => {
            window.location.hash = e.target.dataset['language'];
            window.location.reload();
        });

        const $table = $('#tblframeworks');
        $table.on('draw.dt', () => {
            $('#tblframeworks span.crossref').each((_, span) => {
                let txt = span.textContent.trim().toLowerCase();
                $(span).off('click').on('click', () => {
                    $('td:first-child').each((_, td) => {td.textContent.trim().toLowerCase() === txt && td.scrollIntoView()});
                });
            });
        });

        $('#searchField').on('blur change keyup', () => $table.DataTable().draw());

        let btn = document.getElementById('scrollToTop');
        window.addEventListener('scroll', () => {
            btn.style.display = document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ? 'block' : 'none';
        });
        $(btn).on('click', () => document.body.scrollTop = document.documentElement.scrollTop = 0);
    }

    function initializeDataTable(frameworksJSON, currentLanguage) {
        $.fn.dataTable.ext.search.push((settings, data) => {
            const searchValue = $('#searchField').val().toLowerCase();
            const name = data[0].toLowerCase();
            const desc = data[5].toLowerCase();
            const lastUpdate = data[3].toLowerCase();
            const r = new RegExp(searchValue);
            return (r.test(name) || r.test(desc) || r.test(lastUpdate));
        });

        $.fn.dataTable.ext.type.order['rating-pre'] = (data) => data && data.length || 0;
        $.fn.dataTable.ext.type.order['ispresent-pre'] = (data) => data && data.length && data.includes('fa-times') ? 0 : 1;

        const dataTableData = frameworksJSON.map(record => [record['name'], record['demo'], record['src'], record['lastupdate'], record['rating'], record['desc_' + currentLanguage]]);

        $('#tblframeworks').DataTable({
            data: dataTableData,
            ordering: true,
            order: [[4, 'desc'], [0, 'asc']],
            paging: false,
            info: false,
            language: {
                search: l10nAll[currentLanguage]['search-field'], zeroRecords: l10nAll[currentLanguage]['nothing-found']
            },
            columnDefs: getColumnDefs()
        });
    }

    $.getJSON("data/slideshow-frameworks.json", function (frameworksJSON) {
        const currentLanguage = getCurrentLanguage();
        localize(currentLanguage);
        setupEventHandlers();
        initializeDataTable(frameworksJSON, currentLanguage);
    });
});