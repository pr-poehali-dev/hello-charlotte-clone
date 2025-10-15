import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DialogueOption {
  text: string;
  next: string;
  effect?: string;
}

interface Scene {
  id: string;
  text: string;
  character?: string;
  options?: DialogueOption[];
  isEnding?: boolean;
}

const gameData: Record<string, Scene> = {
  start: {
    id: 'start',
    character: 'Narrator',
    text: 'Ты просыпаешься в темной комнате. Холодный пол под ногами, тишина звенит в ушах. Последнее, что ты помнишь — свет... и голос.',
    options: [
      { text: 'Встать и осмотреться', next: 'look_around' },
      { text: 'Остаться лежать', next: 'stay_down' }
    ]
  },
  look_around: {
    id: 'look_around',
    character: 'Narrator',
    text: 'Комната небольшая. В углу мерцает старый монитор, отбрасывая синеватый свет. На стене царапины — кто-то считал дни. Или что-то другое.',
    options: [
      { text: 'Подойти к монитору', next: 'monitor', effect: 'curious' },
      { text: 'Изучить царапины', next: 'scratches', effect: 'suspicious' }
    ]
  },
  stay_down: {
    id: 'stay_down',
    character: 'Voice',
    text: 'Трусишь? Это не поможет. Вставай. У нас мало времени.',
    options: [
      { text: 'Подчиниться голосу', next: 'look_around' },
      { text: 'Игнорировать', next: 'ignore_voice' }
    ]
  },
  ignore_voice: {
    id: 'ignore_voice',
    character: 'Narrator',
    text: 'Ты закрываешь глаза крепче. Голос становится громче, настойчивее. Темнота начинает давить на грудь. Что-то идет не так.',
    options: [
      { text: 'Открыть глаза', next: 'look_around' },
      { text: 'Продолжать сопротивляться', next: 'bad_ending_1' }
    ]
  },
  monitor: {
    id: 'monitor',
    character: 'Monitor',
    text: 'На экране мерцает текст: "ВЫБОР 1: ПРИНЯТЬ РЕАЛЬНОСТЬ. ВЫБОР 2: ОСТАТЬСЯ В ИЛЛЮЗИИ." Курсор мигает в ожидании.',
    options: [
      { text: 'Выбор 1: Принять реальность', next: 'accept_reality', effect: 'truth' },
      { text: 'Выбор 2: Остаться в иллюзии', next: 'stay_illusion', effect: 'denial' }
    ]
  },
  scratches: {
    id: 'scratches',
    character: 'Narrator',
    text: 'Присмотревшись, ты понимаешь — это не счет дней. Это имена. Десятки имен. Одно из них... твое.',
    options: [
      { text: 'Прикоснуться к своему имени', next: 'touch_name', effect: 'fear' },
      { text: 'Отойти от стены', next: 'monitor' }
    ]
  },
  touch_name: {
    id: 'touch_name',
    character: 'Voice',
    text: 'Узнал себя? Хорошо. Значит, ты еще не полностью потерян. Но их было много до тебя. И многие не смогли выбраться.',
    options: [
      { text: 'Кто ты?', next: 'who_are_you' },
      { text: 'Где я?', next: 'where_am_i' }
    ]
  },
  who_are_you: {
    id: 'who_are_you',
    character: 'Voice',
    text: 'Я? Я — тот, кто наблюдает. Кто записывает. Кто помнит всех, кого забыли. Можешь звать меня Хранителем.',
    options: [
      { text: 'Ты тот, кто держит меня здесь?', next: 'keeper_question' },
      { text: 'Как мне выбраться?', next: 'escape_question' }
    ]
  },
  where_am_i: {
    id: 'where_am_i',
    character: 'Voice',
    text: 'В месте между. Не сон, не явь. Ты здесь, потому что сделал выбор. Или кто-то сделал его за тебя.',
    options: [
      { text: 'Какой выбор?', next: 'what_choice' },
      { text: 'Я хочу уйти', next: 'want_to_leave' }
    ]
  },
  keeper_question: {
    id: 'keeper_question',
    character: 'Voice',
    text: 'Нет. Я не твоя тюрьма. Я — свидетель. Выбор всегда был твоим. Но помни: каждый выбор имеет цену.',
    options: [
      { text: 'Какую цену?', next: 'what_price' },
      { text: 'Я готов заплатить', next: 'ready_to_pay' }
    ]
  },
  escape_question: {
    id: 'escape_question',
    character: 'Voice',
    text: 'Выбраться? Найди дверь. Но перед этим ответь: зачем ты здесь?',
    options: [
      { text: 'Я не знаю', next: 'dont_know' },
      { text: 'Я сам... себя?', next: 'sent_myself' }
    ]
  },
  accept_reality: {
    id: 'accept_reality',
    character: 'Narrator',
    text: 'Экран вспыхивает ярким светом. Боль. Воспоминания обрушиваются потоком. Ты помнишь. Все.',
    options: [
      { text: 'Принять воспоминания', next: 'true_ending' },
      { text: 'Оттолкнуть их', next: 'resist_memories' }
    ]
  },
  stay_illusion: {
    id: 'stay_illusion',
    character: 'Narrator',
    text: 'Экран гаснет. Комната становится теплее. Уютнее. Стены исчезают. Ты чувствуешь себя... безопасно. Но что-то шепчет, что это неправильно.',
    options: [
      { text: 'Довериться ощущению безопасности', next: 'false_comfort_ending' },
      { text: 'Бороться с иллюзией', next: 'fight_illusion' }
    ]
  },
  what_choice: {
    id: 'what_choice',
    character: 'Voice',
    text: 'Забыть или помнить. Страдать или существовать в покое. Ты выбрал страдание. Поэтому ты здесь.',
    options: [
      { text: 'Я хочу вспомнить', next: 'want_to_remember' },
      { text: 'Тогда дай мне покой', next: 'want_peace' }
    ]
  },
  want_to_leave: {
    id: 'want_to_leave',
    character: 'Voice',
    text: 'Уйти можно. Но уйти — значит выбрать. А выбор — это ответственность. Готов ли ты?',
    options: [
      { text: 'Да, я готов', next: 'ready_choice' },
      { text: 'Мне нужно больше времени', next: 'need_time' }
    ]
  },
  want_to_remember: {
    id: 'want_to_remember',
    character: 'Voice',
    text: 'Тогда иди к монитору. Там твой ответ. Но знай — вспомнив, ты не сможешь забыть снова.',
    options: [
      { text: 'Идти к монитору', next: 'monitor' }
    ]
  },
  want_peace: {
    id: 'want_peace',
    character: 'Voice',
    text: 'Покой... Заманчиво, не правда ли? Но покой здесь — это забвение. Ты станешь еще одним именем на стене.',
    options: [
      { text: 'Я согласен', next: 'peace_ending' },
      { text: 'Нет, я передумал', next: 'monitor' }
    ]
  },
  ready_choice: {
    id: 'ready_choice',
    character: 'Voice',
    text: 'Хорошо. Дверь появится. Но помни — за ней либо свобода, либо новая клетка. Выбор покажет, кто ты.',
    options: [
      { text: 'Открыть дверь', next: 'door_choice' }
    ]
  },
  need_time: {
    id: 'need_time',
    character: 'Voice',
    text: 'Время... У нас его нет. Но ты можешь задержаться. Изучить это место. Понять его.',
    options: [
      { text: 'Изучить комнату дальше', next: 'explore_more' }
    ]
  },
  true_ending: {
    id: 'true_ending',
    character: 'Narrator',
    text: 'Ты помнишь все. Боль, любовь, предательство, потерю. Ты помнишь, почему выбрал забвение. И почему решил вернуться. Свет заполняет комнату. Ты свободен. Но шрамы останутся навсегда.',
    isEnding: true
  },
  false_comfort_ending: {
    id: 'false_comfort_ending',
    character: 'Narrator',
    text: 'Тепло окутывает тебя. Воспоминания растворяются. Ты улыбаешься. Больше нет боли. Больше нет страха. Есть только покой. И твое имя добавляется на стену. Еще один, кто выбрал забыть.',
    isEnding: true
  },
  bad_ending_1: {
    id: 'bad_ending_1',
    character: 'Narrator',
    text: 'Темнота поглощает тебя. Голос затихает. Ты остаешься один. Навсегда.',
    isEnding: true
  },
  peace_ending: {
    id: 'peace_ending',
    character: 'Narrator',
    text: 'Ты закрываешь глаза. Принимаешь забвение. Комната растворяется. Боль уходит. Ты становишься частью этого места. Покой. Но какой ценой?',
    isEnding: true
  },
  fight_illusion: {
    id: 'fight_illusion',
    character: 'Voice',
    text: 'Ты сопротивляешься. Иллюзия трещит по швам. Молодец. Не многие могут. Теперь ты видишь правду.',
    options: [
      { text: 'Какую правду?', next: 'see_truth' }
    ]
  },
  see_truth: {
    id: 'see_truth',
    character: 'Voice',
    text: 'Что это место — отражение твоих страхов. Твоих сожалений. Ты создал его сам. И только ты можешь его разрушить.',
    options: [
      { text: 'Как мне разрушить его?', next: 'destroy_place' },
      { text: 'Может, мне не нужно его разрушать', next: 'keep_place' }
    ]
  },
  destroy_place: {
    id: 'destroy_place',
    character: 'Voice',
    text: 'Прими то, от чего бежал. Посмотри в лицо своему прошлому. Только так ты выйдешь.',
    options: [
      { text: 'Я готов', next: 'acceptance_ending' }
    ]
  },
  acceptance_ending: {
    id: 'acceptance_ending',
    character: 'Narrator',
    text: 'Ты вспоминаешь. Все. Хорошее и плохое. Боль смешивается с радостью. Слезы со смехом. Ты принимаешь себя. Таким, какой ты есть. Комната рушится. Ты просыпаешься. По-настоящему.',
    isEnding: true
  },
  keep_place: {
    id: 'keep_place',
    character: 'Voice',
    text: 'Интересный выбор. Значит, ты принимаешь свою тьму. Живешь с ней. Это... мудро. Или безумно. Время покажет.',
    options: [
      { text: 'Остаться в комнате', next: 'stay_ending' }
    ]
  },
  stay_ending: {
    id: 'stay_ending',
    character: 'Narrator',
    text: 'Ты остаешься. Не в забвении, а в осознанности. Комната больше не тюрьма. Она — твое убежище. Ты Хранитель теперь. Свидетель. И когда кто-то новый появится здесь, ты будешь тем голосом.',
    isEnding: true
  },
  door_choice: {
    id: 'door_choice',
    character: 'Narrator',
    text: 'Дверь открывается. За ней свет. Или тьма? Ты не знаешь. Но ты делаешь шаг. И это главное.',
    options: [
      { text: 'Шагнуть в свет', next: 'light_ending' },
      { text: 'Шагнуть в тьму', next: 'dark_ending' }
    ]
  },
  light_ending: {
    id: 'light_ending',
    character: 'Narrator',
    text: 'Свет ослепляет. Но за ним — мир. Реальный. Несовершенный. Пугающий. Но настоящий. Ты сделал выбор. Жить.',
    isEnding: true
  },
  dark_ending: {
    id: 'dark_ending',
    character: 'Narrator',
    text: 'Тьма обнимает тебя. Но это не конец. Это начало. Новое путешествие. Новые вопросы. И может быть, новые ответы.',
    isEnding: true
  },
  explore_more: {
    id: 'explore_more',
    character: 'Narrator',
    text: 'Ты обходишь комнату снова. Находишь маленькую трещину в углу. Оттуда доносится шепот. Множество голосов.',
    options: [
      { text: 'Прислушаться к голосам', next: 'listen_voices' },
      { text: 'Игнорировать и вернуться', next: 'monitor' }
    ]
  },
  listen_voices: {
    id: 'listen_voices',
    character: 'Voices',
    text: 'Они рассказывают истории. Свои истории. Выборы, которые они сделали. Сожаления. Надежды. Ты понимаешь — ты не один.',
    options: [
      { text: 'Присоединиться к голосам', next: 'join_voices_ending' },
      { text: 'Продолжить свой путь', next: 'monitor' }
    ]
  },
  join_voices_ending: {
    id: 'join_voices_ending',
    character: 'Narrator',
    text: 'Ты становишься частью хора. Твой голос добавляется к остальным. Не забвение, не свобода. Что-то среднее. Вечное существование в историях. В памяти.',
    isEnding: true
  },
  dont_know: {
    id: 'dont_know',
    character: 'Voice',
    text: 'Незнание — честный ответ. Многие не признаются. Ладно. Тогда исследуй. Найди свой ответ.',
    options: [
      { text: 'Продолжить исследование', next: 'explore_more' }
    ]
  },
  someone_sent: {
    id: 'someone_sent',
    character: 'Voice',
    text: 'Кто-то послал? Интересно. Кто? И зачем?',
    options: [
      { text: 'Я не помню', next: 'dont_remember' },
      { text: 'Я сам... себя?', next: 'sent_myself' }
    ]
  },
  dont_remember: {
    id: 'dont_remember',
    character: 'Voice',
    text: 'Не помнишь. Или не хочешь помнить. Но ответ внутри тебя. Всегда был.',
    options: [
      { text: 'Копнуть глубже в память', next: 'dig_memory' }
    ]
  },
  dig_memory: {
    id: 'dig_memory',
    character: 'Narrator',
    text: 'Ты закрываешь глаза. Погружаешься в себя. Образы мелькают. Лица. Места. И одно воспоминание ярче всех.',
    options: [
      { text: 'Сфокусироваться на нем', next: 'focus_memory' }
    ]
  },
  focus_memory: {
    id: 'focus_memory',
    character: 'Memory',
    text: 'Ты помнишь. Момент, когда все пошло не так. Когда ты сделал тот выбор. Когда решил забыть. Это было твое решение.',
    options: [
      { text: 'Жалеешь ли ты?', next: 'regret_choice' },
      { text: 'Сделал бы так снова?', next: 'repeat_choice' }
    ]
  },
  regret_choice: {
    id: 'regret_choice',
    character: 'Voice',
    text: 'Сожаление — это человечно. Но оно не меняет прошлое. Только будущее. Что ты выберешь для будущего?',
    options: [
      { text: 'Исправить ошибку', next: 'fix_mistake' },
      { text: 'Принять и двигаться дальше', next: 'accept_and_move' }
    ]
  },
  repeat_choice: {
    id: 'repeat_choice',
    character: 'Voice',
    text: 'Значит, ты не жалеешь. Интересно. Тогда зачем ты здесь? Зачем борешься?',
    options: [
      { text: 'Я не знаю', next: 'confused_ending' },
      { text: 'Потому что должен', next: 'must_fight' }
    ]
  },
  fix_mistake: {
    id: 'fix_mistake',
    character: 'Voice',
    text: 'Исправить... Благородно. Но некоторые ошибки нельзя исправить. Можно только научиться жить с ними.',
    options: [
      { text: 'Тогда я научусь', next: 'learn_ending' }
    ]
  },
  learn_ending: {
    id: 'learn_ending',
    character: 'Narrator',
    text: 'Ты принимаешь урок. Боль превращается в мудрость. Сожаление — в силу. Ты не исправляешь прошлое, но создаешь новое будущее. И выходишь из этого места другим человеком.',
    isEnding: true
  },
  accept_and_move: {
    id: 'accept_and_move',
    character: 'Narrator',
    text: 'Принятие — это мужество. Ты отпускаешь прошлое. Не забываешь, но отпускаешь. И идешь дальше. Легче. Свободнее.',
    options: [
      { text: 'Идти к двери', next: 'door_choice' }
    ]
  },
  confused_ending: {
    id: 'confused_ending',
    character: 'Narrator',
    text: 'Ты запутался. И это нормально. Не все ответы ясны. Не все пути прямы. Ты остаешься в неопределенности. Может, это тоже выбор.',
    isEnding: true
  },
  must_fight: {
    id: 'must_fight',
    character: 'Voice',
    text: '"Должен". Сильное слово. Кто заставляет тебя? Долг? Совесть? Или что-то еще?',
    options: [
      { text: 'Я сам', next: 'self_duty' },
      { text: 'Кто-то другой', next: 'other_duty' }
    ]
  },
  self_duty: {
    id: 'self_duty',
    character: 'Voice',
    text: 'Ты сам. Значит, это твой выбор. Твоя воля. Хорошо. Тогда прими последствия.',
    options: [
      { text: 'Я готов', next: 'ready_consequences' }
    ]
  },
  ready_consequences: {
    id: 'ready_consequences',
    character: 'Narrator',
    text: 'Ты готов. Ты принимаешь все — боль, радость, страх, надежду. Ты выбираешь полноту жизни. Комната исчезает. Ты возвращаешься. Но уже не тем, кем был.',
    isEnding: true
  },
  other_duty: {
    id: 'other_duty',
    character: 'Voice',
    text: 'Кто-то другой... Ты живешь чужими ожиданиями? Или это твоя любовь к ним заставляет тебя?',
    options: [
      { text: 'Любовь', next: 'love_duty' },
      { text: 'Ожидания', next: 'expectations_duty' }
    ]
  },
  love_duty: {
    id: 'love_duty',
    character: 'Narrator',
    text: 'Любовь — самая сильная мотивация. И самая опасная. Но ты выбираешь ее. И это делает тебя человеком. Светом в темноте.',
    options: [
      { text: 'Вернуться к ним', next: 'love_ending' }
    ]
  },
  love_ending: {
    id: 'love_ending',
    character: 'Narrator',
    text: 'Ты возвращаешься. К тем, кого любишь. К тому, что важно. Комната отпускает тебя. Потому что твоя любовь сильнее любого забвения.',
    isEnding: true
  },
  expectations_duty: {
    id: 'expectations_duty',
    character: 'Voice',
    text: 'Ожидания... Клетка из чужих надежд. Тяжелое бремя. Хочешь ли ты его нести?',
    options: [
      { text: 'Да, я должен', next: 'burden_ending' },
      { text: 'Нет, я хочу свободы', next: 'freedom_choice' }
    ]
  },
  burden_ending: {
    id: 'burden_ending',
    character: 'Narrator',
    text: 'Ты несешь бремя. Чужие мечты на твоих плечах. Тяжело. Больно. Но ты идешь. Шаг за шагом. Это тоже подвиг. Пусть и невидимый.',
    isEnding: true
  },
  freedom_choice: {
    id: 'freedom_choice',
    character: 'Voice',
    text: 'Свобода... Значит, ты готов отпустить? Разочаровать? Жить для себя?',
    options: [
      { text: 'Да, я готов', next: 'freedom_ending' },
      { text: 'Мне страшно', next: 'fear_of_freedom' }
    ]
  },
  freedom_ending: {
    id: 'freedom_ending',
    character: 'Narrator',
    text: 'Ты выбираешь себя. Свой путь. Свою жизнь. Кто-то не поймет. Кто-то осудит. Но ты свободен. И это твое право.',
    isEnding: true
  },
  fear_of_freedom: {
    id: 'fear_of_freedom',
    character: 'Voice',
    text: 'Страх свободы... Понятно. Свобода — это ответственность. Неизвестность. Но ты уже сделал первый шаг — признал свой страх.',
    options: [
      { text: 'Что дальше?', next: 'what_next' }
    ]
  },
  what_next: {
    id: 'what_next',
    character: 'Voice',
    text: 'Дальше — выбор. Снова и снова. Каждый день. Иногда ты будешь выбирать свободу. Иногда — безопасность. И это нормально.',
    options: [
      { text: 'Я понимаю', next: 'understanding_ending' }
    ]
  },
  understanding_ending: {
    id: 'understanding_ending',
    character: 'Narrator',
    text: 'Ты понимаешь. Не все. Но достаточно. Комната больше не держит тебя. Ты уходишь. Не с ответами на все вопросы. Но с пониманием, что это нормально.',
    isEnding: true
  },
  sent_myself: {
    id: 'sent_myself',
    character: 'Voice',
    text: 'Сам себя? Парадокс. Или прозрение. Может, ты всегда был здесь. И всегда будешь. Вопрос только — в какой роли.',
    options: [
      { text: 'Я хочу понять', next: 'want_understand' }
    ]
  },
  want_understand: {
    id: 'want_understand',
    character: 'Voice',
    text: 'Понимание приходит через опыт. Исследуй. Выбирай. Ошибайся. Учись. Это твое путешествие.',
    options: [
      { text: 'Начать путешествие', next: 'journey_ending' }
    ]
  },
  journey_ending: {
    id: 'journey_ending',
    character: 'Narrator',
    text: 'Ты начинаешь путешествие. Не к выходу, а внутрь себя. Комната трансформируется. Становится лабиринтом. Зеркалом. Учителем. И ты идешь. Куда — покажет время.',
    isEnding: true
  },
  resist_memories: {
    id: 'resist_memories',
    character: 'Narrator',
    text: 'Ты сопротивляешься. Воспоминания больно бьют, пытаясь прорваться. Экран трещит. Что-то идет не так.',
    options: [
      { text: 'Продолжать сопротивляться', next: 'resist_ending' },
      { text: 'Сдаться', next: 'true_ending' }
    ]
  },
  resist_ending: {
    id: 'resist_ending',
    character: 'Narrator',
    text: 'Ты сопротивляешься до конца. Экран взрывается. Осколки. Темнота. Тишина. Ты остаешься в пустоте. Без воспоминаний. Без боли. Но и без себя.',
    isEnding: true
  },
  what_price: {
    id: 'what_price',
    character: 'Voice',
    text: 'Цена — это часть тебя. Воспоминание. Чувство. Может, даже сама возможность забыть. Каждый платит свое.',
    options: [
      { text: 'Я заплачу', next: 'ready_to_pay' },
      { text: 'Это слишком дорого', next: 'too_expensive' }
    ]
  },
  ready_to_pay: {
    id: 'ready_to_pay',
    character: 'Voice',
    text: 'Смелое решение. Или глупое. Покажет результат. Иди же. Твой выбор ждет.',
    options: [
      { text: 'Идти вперед', next: 'monitor' }
    ]
  },
  too_expensive: {
    id: 'too_expensive',
    character: 'Voice',
    text: 'Слишком дорого... Тогда что ты готов предложить? Здесь ничего не дается даром.',
    options: [
      { text: 'Я не знаю', next: 'dont_know_price' },
      { text: 'Время. Я останусь здесь', next: 'offer_time' }
    ]
  },
  dont_know_price: {
    id: 'dont_know_price',
    character: 'Voice',
    text: 'Не знаешь... Тогда тебе нужно больше времени подумать. Или больше понять.',
    options: [
      { text: 'Дай мне время', next: 'need_time' }
    ]
  },
  offer_time: {
    id: 'offer_time',
    character: 'Voice',
    text: 'Время? Интересное предложение. Стать частью этого места. Наблюдать. Помогать другим. Это... благородно.',
    options: [
      { text: 'Я согласен', next: 'stay_ending' }
    ]
  }
};

const Index = () => {
  const [currentScene, setCurrentScene] = useState<string>('start');
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const scene = gameData[currentScene];

  useEffect(() => {
    if (!scene) return;
    
    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    const text = scene.text;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentScene, scene]);

  const handleChoice = (next: string) => {
    if (!isTyping) {
      setCurrentScene(next);
    }
  };

  const restartGame = () => {
    setCurrentScene('start');
    setGameStarted(false);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#16213E] via-[#0F3460] to-[#1A1A2E] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full bg-card/50 backdrop-blur-sm border-border/50 p-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl font-bold text-glow text-accent mb-4" style={{ fontFamily: 'Impact, sans-serif', letterSpacing: '2px' }}>
              TWISTED PATHS
            </h1>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-lg">Психологический хоррор-квест</p>
              <p className="text-sm">Твои выборы определят концовку</p>
              <div className="flex justify-center gap-4 text-xs opacity-60">
                <span className="flex items-center gap-1">
                  <Icon name="MessageSquare" size={14} />
                  Диалоги
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="GitBranch" size={14} />
                  Множество концовок
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Eye" size={14} />
                  Мрачная атмосфера
                </span>
              </div>
            </div>
            <Button 
              onClick={() => setGameStarted(true)}
              size="lg"
              className="bg-accent hover:bg-accent/80 text-accent-foreground mt-8 text-lg px-8"
            >
              Начать игру
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#16213E] via-[#0F3460] to-[#1A1A2E] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50 p-8 shadow-2xl">
          {scene.character && (
            <div className="text-sm text-primary font-semibold mb-4 flex items-center gap-2">
              <Icon name="User" size={16} />
              {scene.character}
            </div>
          )}
          
          <div className="min-h-[200px] mb-8">
            <p className="text-lg text-foreground leading-relaxed dialogue-text">
              {displayedText}
              {isTyping && <span className="animate-pulse">▌</span>}
            </p>
          </div>

          {!isTyping && scene.isEnding ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <p className="text-accent text-sm font-semibold mb-2">КОНЦОВКА</p>
                <div className="h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              </div>
              <Button 
                onClick={restartGame}
                className="w-full bg-primary hover:bg-primary/80"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Начать заново
              </Button>
            </div>
          ) : !isTyping && scene.options ? (
            <div className="space-y-3">
              {scene.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(option.next)}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-4 px-6 border-2 border-border hover:border-primary hover:bg-primary/10 transition-all duration-300"
                >
                  <span className="text-primary mr-3 text-xl">›</span>
                  <span className="flex-1">{option.text}</span>
                </Button>
              ))}
            </div>
          ) : isTyping ? (
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setDisplayedText(scene.text);
                  setIsTyping(false);
                }}
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Пропустить
              </Button>
            </div>
          ) : null}
        </Card>

        <div className="mt-4 text-center">
          <Button
            onClick={restartGame}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="RotateCcw" size={14} className="mr-2" />
            Вернуться в меню
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
