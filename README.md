# 概要
このシステムはタスク管理アプリです。会員登録が可能で、会員毎に複数のタスクを作成、編集、削除ができます。タスクの登録内容として、タスク名、優先順位、状態、タスク内容の4項目を入力可能です。
# システム構成
- TypeScript
- React ver18.0
- Firebase Firestore
- Firebase Authentication
- Firebase Hosting
- chakra-ui

# 画面イメージ
ログイン画面\
![login画面](/doc/images/login.jpg "login画面")\
会員登録画面\
![registration画面](/doc/images/registration.jpg "registration画面")\
パスワードリセット申請画面\
![resetpassword画面](/doc/images/resetpassword.jpg "resetpassword画面")\
ユーザーホーム画面00\
![userhome00画面](/doc/images/userhome00.jpg "userhome00画面")\
ログアウト画面\
![logout画面](/doc/images/logout.jpg "logout画面")\
パスワード更新画面\
![updatepassword画面](/doc/images/updatepassword.jpg "updatepassword画面")\
新規タスク登録画面\
![login画面](/doc/images/createtask.jpg "login画面")\
ユーザーホーム画面01\
![userhome01画面](/doc/images/userhome01.jpg "userhome01画面")\
ユーザーホーム画面02（編集ボタン・削除ボタン）\
![userhome02画面](/doc/images/userhome02(editbutton,deletebutton).jpg "userhome02画面")\
タスク編集画面\
![edittask画面](/doc/images/edittask.jpg "edittask画面")\
タスク削除画面\
![deletetask画面](/doc/images/deletetask.jpg "deletetask画面")\
ユーザーホーム画面03\
![userhome03画面](/doc/images/userhome03.jpg "userhome03画面")\


# 今後のアップデートの予定
- タスクの遅延等がわかるスケジュール管理機能
- 優先順位や納期等でソートができる表示機能
- タスク達成状況がグラフや表で分析できる機能