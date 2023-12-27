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
    },
    'ru': {
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

$(function () {
    $.getJSON("data/slideshow-frameworks.json", function (frameworksJSON) {
        function localize(language) {
            let l10n = l10nAll[language];
            for (let record of frameworksJSON)
                record['desc'] = record['desc_' + language];

            document.title = l10n['title'];

            for (let col of ["name", "demo", "src", "lastupdate", "desc", "rating"])
                $('th.' + col).text(l10n['col-' + col]);

            for (let p in l10n)
                $('.' + p).html(l10n[p]);

            document.getElementById('searchField').setAttribute('placeholder', l10n['search-field-placeholder']);
        }

        let currentLanguage = navigator.languages.includes('ru') ? 'ru' : 'en';
        if (window.location.hash === '#ru')
            currentLanguage = 'ru';
        else if (window.location.hash === '#en')
            currentLanguage = 'en';
        localize(currentLanguage);
        $('img[data-language]').click((e) => {
            window.location.hash = e.target.dataset['language'];
            window.location.reload();
        });

        $.fn.dataTable.ext.search.push(
            (settings, data) => {
                const searchValue = $('#searchField').val().toLowerCase();
                const name = data[0].toLowerCase();
                const desc = data[5].toLowerCase();
                const lastUpdate = data[3].toLowerCase();
                const r = new RegExp(searchValue);
                return (r.test(name) || r.test(desc) || r.test(lastUpdate));
            }
        );

        let data = [];
        frameworksJSON.forEach(record => {
            data.push([
                record['name'],
                record['demo'],
                record['src'],
                record['lastupdate'],
                record['rating'],
                record['desc']
            ]);
        });

        $.fn.dataTable.ext.type.order['rating-pre'] = (data) => data && data.length || 0;
        $.fn.dataTable.ext.type.order['ispresent-pre'] = (data) => data && data.length && data.includes('fa-times') ? 0 : 1;

        const $table = $('#tblframeworks');

        $table.on('draw.dt', () => {
            $('#tblframeworks span.crossref').each((_, e) => {
                let $e = $(e);
                let txt = e.textContent.trim().toLowerCase();
                $e.click(() => {
                    $('td:first-child').each((_, td) => {
                        td.textContent.trim().toLowerCase() === txt && td.scrollIntoView()
                    });
                });
            });
        });

        $table.DataTable({
            data: data,
            ordering: true,
            order: [[4, 'desc'], [0, 'asc']],
            paging: false,
            info: false,
            language: {
                search: l10nAll[currentLanguage]['search-field'],
                zeroRecords: l10nAll[currentLanguage]['nothing-found']
            },
            columnDefs: [
                {orderable: true, targets: [0, 1, 2, 3, 4]},
                {orderable: false, targets: -1},
                {
                    targets: 'src',
                    type: 'ispresent',
                    render: (data) => {
                        if (data) {
                            const icon = data.match(/github\./) ? 'fa-brands fa-github' : 'fa-solid fa-code';
                            return `<a class="btn btn-outline-secondary print-hide" href="${data}"><i class="${icon}" aria-hidden="true"></i></a><a class="print-only" href="${data}">${data}</a>`;
                        } else {
                            return '<i class="fa fa-times" aria-hidden="true"></i>';
                        }
                    }
                },
                {
                    targets: 'demo',
                    type: 'ispresent',
                    render: (data) => {
                        if (data) {
                            return `<a class="btn btn-outline-secondary print-hide" href="${data}"><i class="fa fa-television" aria-hidden="true"></i></a><a class="print-only" href="${data}">${data}</a>`;
                        } else {
                            return '<i class="fa fa-times" aria-hidden="true"></i>';
                        }
                    }
                },
                {
                    targets: 'rating',
                    type: 'rating',
                    render: (data) => data ? '<i class="fa fa-star" aria-hidden="true"></i>'.repeat(parseInt(data)) : ''
                }
            ],
        });
        $('#searchField').on('blur change keyup', () => $table.DataTable().draw());
    });
});