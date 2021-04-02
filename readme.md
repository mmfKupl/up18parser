#билд исходников

```
npm i -g pkg;

pkg .
```

#как пользоваться

открыть консоль в папке с exe файлом, выполнить команду
```
./up18parser.exe
```

#настройки

по умолчанию будет скачивать информацию со страницы - https://up18.by/brends/toya/

можно использовать следующие флаги для управления настройками парсера:

--url или --u - определяет ссылку на страницу, с которой нужно спарсить данные
```
пример
./up18parser.exe --u="https://up18.by/brends/festool/"
./up18parser.exe --url="https://up18.by/brends/festool/"
```

--folder или --f - опрделяет название папки в которую будут скачаны картинки, по умолчанию `files`
```
пример
./up18parser.exe --f="images" --url="https://up18.by/brends/festool/"
./up18parser.exe --folder="images"
```

--fileName или --fn - определяет какого названия будет результирующий json файл, можно писать без .json - оно добавиться автоматически, по умолчанию называется `data.json`
```
пример
./up18parser.exe --fileName="festool"
./up18parser.exe --fn="festool.json"
```

--withoutImages или --wi - если этот флаг добавлен к запуску, то картинки скачиваться не будут, а на их именах будет использоваться ссылка на картинку, по умолчанию картинки скачиваются
```
пример
./up18parser.exe --withoutImages=true
./up18parser.exe --withoutImages
./up18parser.exe --wi
```

--urlsToParse или --utp - если есть этот флаг, то будет прочитан файл по указанному пути, и будут распашены только указанные в файле страницы
```
пример
есть файл sample.json
с содержанием
[
    "https://up18.by/catalog/zapchasti-i-detali-dlya-elektroinstrumenta/prochie-zapasnye-chasti-k-instrumentu-bosch/?page=5",
    "https://up18.by/catalog/zapchasti-i-detali-dlya-elektroinstrumenta/prochie-zapasnye-chasti-k-instrumentu-bosch/?page=15"
]


./up18parser.exe --utp="sample.json" - результат будет сбор данных с этих двух страниц
```


еще примеры
```
./up18parser.exe --u="https://up18.by/brends/stanley/" --f="stanley-imgs" --fn="stanley"

./up18parser.exe --wi --url="https://up18.by/brends/fein/"
```
