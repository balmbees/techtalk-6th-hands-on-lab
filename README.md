# Vingle Tech Talk 6th Hands-on Lab


## Table of Contents

- [본 세션을 진행하기 위해 필요한 것들](#%EB%B3%B8-%EC%84%B8%EC%85%98%EC%9D%84-%EC%A7%84%ED%96%89%ED%95%98%EA%B8%B0-%EC%9C%84%ED%95%B4-%ED%95%84%EC%9A%94%ED%95%9C-%EA%B2%83%EB%93%A4)
- [개발환경 준비](#%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%A4%80%EB%B9%84)

<br><br><br>

------------

<br><br><br>


## 본 세션을 진행하기 위해 필요한 것들

- Node.js 6 이상 - [Windows Installer][nodejs-windows-installer] / [macOS Installer][nodejs-macos-installer] / [Linux Installer][nodejs-linux-installer]
- Chrome Browser - [Download][chrome-download]
- Javascript IDE - [Jetbrains WebStorm][webstorm-download] / [Microsoft VSCode][vscode-download]
- Postman - [Download][postman-download]

<br><br><br>

## 개발환경 준비

### 1. 프로젝트 복사

#### Git을 사용할 수 있는 경우

아래 명령과 같이 프로젝트를 복사합니다:

```bash
$ git clone https://github.com/balmbees/techtalk-6th-hands-on-lab.git
```

#### Git을 사용할 수 없는 경우

아래 링크를 통해 압축된 프로젝트를 내려받고, 적절한 위치에 압축을 해제하세요.

[다운로드](https://github.com/balmbees/techtalk-6th-hands-on-lab/archive/master.zip)

<br>

### 2. 프로젝트 의존성 설치

터미널에서 프로젝트 디렉토리로 들어간 후, 아래 명령을 실행해 필요한 의존성들을 설치합니다:

```bash
$ npm install
```


## IAM Credential 준비

> What's IAM?
>
> IAM은 AWS에 대한 접근을 관리하는 서비스입니다.
> 리소스를 생성하거나, 삭제하거나, 혹은 사용하기 위해 접근하려면 적합한 IAM 권한이 있어야 합니다.


> NOTE
>
> 만약 로컬 환경에 이미 AWS Credential이 설정되어 있다면, 이 과정을 건너뛰실 수 있습니다.
> 또한, 여기서는 서울 리전을 기준으로하나, 원하는 리전을 선택해도 무방합니다.

[AWS Console][aws-console]에 로그인 후, [IAM Console][iam-console]로 이동하세요.

![IAM LNB](images/iam-users.png)

1. 좌측 패널의 `Users` 링크를 클릭해, Users 패널로 진입합니다.

![IAM Users Panel](images/iam-add-user.png)

2. 그 후, 패널 상단의 `Add User` 버튼을 클릭합니다.

![IAM User Add Step 1](images/iam-user-add-01.png)

3. User name을 입력하는 곳에 `vingle-hands-on-lab` 을 입력합니다,
4. `Programmatic access` 항목을 체크합니다.
5. `Next: Permissions` 버튼을 클릭해 다음 페이지로 넘어갑니다.

![IAM User Add Step 2](images/iam-user-add-02.png)

6. `Attach existing policies directly` 버튼을 클릭합니다.
7. 리스트에 표시된 항목 중, `AdministratorAccess` 항목을 선택합니다.
8. `Next: Review` 버튼을 클릭합니다.

![IAM User Add Step 3](images/iam-user-add-03.png)

9. `Create user` 버튼을 클릭합니다.

![IAM User Add Step 4](images/iam-user-add-04.png)

10. IAM User 생성이 완료되었습니다. 로컬 환경에서 해당 인증정보를 사용하기 위해, 추가적인 작업이 더 필요합니다.
11. 생성된 `Access key ID`를 복사합니다.

![IAM User Add Step 5](images/iam-user-add-05.png)

12. 열어둔 터미널로 되돌아가서, 아래 명령을 실행합니다.

```bash
$ echo 'export AWS_ACCESS_KEY_ID=붙여넣기' >> .aws-credentials
```

![IAM User Add Step 6](images/iam-user-add-06.png)

13. 다시 브라우저로 돌아가서, 이번에는 `Secret access key`를 복사합니다.
`Secret access key`가 가려져 있는 경우, `Show` 텍스트를 클릭하면 해당 값을 확인할 수 있습니다.


![IAM User Add Step 7](images/iam-user-add-07.png)

14. 열어둔 터미널로 되돌아가서, 아래 명령을 실행해 인증정보를 저장합니다.

```bash
$ echo 'export AWS_SECRET_ACCESS_KEY=붙여넣기' >> .aws-credentials
```

15. 아래 명령을 실행해 키가 올바른지 저장되었는지 다시 한번 체크합니다.

```bash
$ cat .aws-credentials
```

16. 저장된 인증정보를 아래 명령을 통해 터미널에서 쓸 수 있도록 불러옵니다.

```bash
$ source .aws-credentials
```

17. IAM 설정이 끝났습니다! 브라우저로 돌아가서, Close 버튼을 눌러 사용자를 추가하는 화면을 닫아주세요.

이제 만들어진 IAM 계정을 통해 필요한 리소스들을 생성하고 접근할 수 있습니다 :)

<br><br><br>

## 수집 API 작성
1. 람다로 들어오는 이벤트 payload 가 어떻게 구성되는지 확인하기 위해 API 로 들어오는 event 를 console.log 로 찍습니다.
```js
exports.collect = (event, context, callback) => {
  console.log(event);
  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { success: true },
    }),
  });
};
```

2. collect function 을 호출하는 local server 를 띄웁니다.
```bash
npm run dev
```

3. http://www.lvh.me:{port_number}/events 로 POST 요청을 보낸 다음 event 의 인터페이스가 어떻게 구성되어 있는지 확인합니다.
    * Postman
    ![image](https://user-images.githubusercontent.com/29109668/44760860-b9b87200-ab7b-11e8-9937-47b087a49b65.png)
    * wget
    ```bash
    wget --quiet \
    --method POST \
    --header 'Content-Type: application/json' \
    --header 'accept-language: ko' \
    --header 'Cache-Control: no-cache' \
    --body-data '{\n	"action": "click",\n	"userId": 404444,\n	"buttonName": "helloWorld"\n}' \
    --output-document \
    - {API_ADDRESS}
    ```
    * curl
    ```bash
    curl -X POST \
    {API_ADDRESS} \
    -H 'Cache-Control: no-cache' \
    -H 'Content-Type: application/json' \
    -H 'accept-language: ko' \
    -d '{
     "action": "click",
     "userId": 404444,
     "buttonName": "helloWorld"
    }'
    ```

4. 이벤트가 어떤 인터페이스로 들어오는지는 확인됐으니 aws-sdk 를 이용해 firehose 로 body 로 들어온 data 를 보내는 로직을 구현합니다.
```js
const AWS = require('aws-sdk');

exports.collect = (event, context, callback) => {
  const body = JSON.parse(event.body);
  const firehose = new AWS.Firehose();
  console.log(`Body payload: ${JSON.stringify(body, null, 2)}`);

  firehose.putRecord({
    DeliveryStreamName: "DataTracker-prod",
    Record: {
      Data: `${JSON.stringify(body)}\n`
    }
  }).promise().then(res => res).catch(err => console.error(err));

  callback(null, {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { success: true },
    }),
  });
};
```

5. 위 로직은 아직 firehose 가 여러분들 계정에 생성되어 있지 않기 때문에 로컬에서 테스트가 불가능합니다. 그러므로 지금까지 한 내용을 아래 명령어로 배포한 다음에 실제로 http 요청을 보내보겠습니다. 수집 API 에서 사용하는 AWS 서비스들은 배포스크립트를 돌릴 때 자동으로 생성되도록 설정해두었으므로 따로 신경쓰실 부분은 없습니다.
```bash
npm run deploy:prod -- --identifier {your_identifier_word(lowercase)}
```

6. 아래 명령어를 통해 API Gateway 주소를 확인합니다.
```bash
npm run server_info -- --identifier {your_identifier_word(lowercase)}
```

7. 확인하신 API Gateway 주소로 Step3 에서와 같이 요청을 보냅니다.

8. 아래 명령어를 통해 body payload 가 정상적으로 들어오는지 확인하기 위해 찍어둔 console.log 를 체크합니다.
```bash
npm run logs -- --identifier {your_identifier_word(lowercase)}
```

9. 정상적으로 body payload 가 들어오는 것이 확인되셨으면 [Firehose console](https://ap-northeast-2.console.aws.amazon.com/firehose/home?region=ap-northeast-2#/details/DataTracker-prod/monitoring)에 들어가서 전송한 event 가 metrics 에 잘 찍히는지 확인합니다.

10. 확인이 완료되면 [S3 home](https://s3.console.aws.amazon.com/s3/home?region=ap-northeast-2)에 들어가서 {identifier}-google-analytics 라고 되어있는 bucket으로 들어갑니다.

11. 해당 버킷에 들어있는 파일을 다운받습니다. 다운받을 때 압축이 풀리면서 다운이 되는데 확장자는 변경되지 않은 상태로 다운이 되므로 .gz 확장자를 .json 으로 바꾸고 연 다음 아까 보냈던 payload 가 정상적으로 들어있는지 확인합니다.


<br><br><br>

----------

<br><br><br>

## 웹앱에서 데이터 수집

프로젝트에 미리 만들어둔 샘플 웹앱이 있습니다.
이 웹앱은 비디오 스트리밍 플랫폼에서 재생하는 부분만 간단히 구현한 것입니다.
자, 우리가 이재 비디오 스트리밍 플랫폼을 운영한다고 생각해봅시다.

어떤 데이터를 보고 싶은지, 어떤 데이터를 쌓아야하는지 알아봅시다.

### 확인하고 싶은 지표 설정

두가지 지표를 예로 들어보겠습니다.

- 비디오별 총 재생 시간
- 유저별 평균 시청 지속 시간


### 로그 포맷

위 데이터를 수집하기 위해, 쌓아야 할 로그 데이터의 정보를 정리해보면 다음과 같은 정보들이 필요할 것입니다

- 비디오 ID
- 유저 ID
- 재생 시작 시간
- 재생 종료 시간
- 로그 기록 시간
- 재생한 기기에 대한 정보
- 비디오가 재생된 경로 (Referer URL)


이를 JSON으로 표현해보면 다음과 같을 것입니다:

```json
{
  "video_id": "foobarbaz",
  "user_id": 12345,
  "started_at": 0,
  "ended_at": 14000,
  "logged_at": 1535523716167,
  "referer": "http://www.lvh.me:57183/",
  "user_agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
}
```


### 웹앱 실행하기

터미널에서 다음 명령을 실행하면, 브라우저로 웹앱이 열릴 것입니다:

```bash
$ npm run dev
```

브라우저애서 `마우스 우클릭` -> `검사` 를 순서대로 클릭해 개발자 도구를 열고, 개발자 도구 상단의 `Console` 탭을 선택해주세요.

웹앱에서는 필요한 이벤트 바인딩이 이미 되어있고, 위 로그 포맷에 맞게 로그를 출력하도록 미리 만들어져 있습니다.

비디오를 직접 재생해서, 로그가 정상적으로 출력되는지 확인해봅시다.


### API 전송하기

우리가 S3에 데이터를 쌓기 위해서는, 이전 단계에서 만든 수집 API를 호출하기만 하면 됩니다.

수집 API를 호출하는 코드는 이미 작성되어 있지만, 주석으로 처리되어 있어 실행되지는 않고 있습니다.
먼저, recordEvent 함수에서 주석을 제거하세요, 페이지를 새로고쳐 갱신된 웹앱을 불러오세요.

이전과 동일하게 이벤트를 발생시키면, 터미널에서도 레코드가 수신된 것을 확인할 수 있습니다.


### 프로덕션으로 배포하기

여기까지 진행이 되었다면, 이제 프로덕션으로 다시 배포할 차례입니다.
터미널에서 아래 명령을 입력해 변경된 사항을 배포하세요:

```bash
$ npm run deploy:prod -- --identifier {yournickname(lowercase)}
```


## Athena로 데이터 쿼리하기

### Athena

- Athena는 SQL을 사용해 S3에 저장된 데이터를 손쉽게 쿼리할 수 있는 서비스
- 별도의 서버나 인프라 구성을 필요로 하지 않음
- 실행한 쿼리에서 실제로 데이터를 읽은 만큼만 요금 과금 (1TB당 $5)


### 테이블 생성

[Athena Console](https://ap-northeast-2.console.aws.amazon.com/athena/home?region=ap-northeast-2)로 들어갑니다

> Tutorial Dialog가 뜨면 X 버튼을 눌러 닫아주세요.

Get Started 버튼을 클릭하면, Query Editor가 표시됩니다.

먼저, 아래 SQL을 실행해 데이터베이스를 생성합니다.

```sql
CREATE DATABASE vingle_hands_on_lab;
```

그 다음, 아래 SQL을 실행해 S3 버킷의 로그를 참조하는 테이블을 생성합니다.
쿼리를 실행하기 전에, 반드시 아래 SQL에서 S3 경로를 실제 로그 데이터의 위치로 변경하세요:

아래 명령을 실행해 Bucket Name과 Firehose Log Prefix를 확인할 수 있습니다:

```bash
$ npm run server_info
```

```sql
CREATE EXTERNAL TABLE IF NOT EXISTS vingle_hands_on_lab.video_play_events (
  `video_id` string,
  `user_id` int,
  `started_at` int,
  `ended_at` int,
  `logged_at` timestamp,
  `referer` string,
  `user_agent` string
)
ROW FORMAT SERDE 'org.openx.data.jsonserde.JsonSerDe'
WITH SERDEPROPERTIES (
  'serialization.format' = '1'
) LOCATION 's3://BUCKET_NAME/FIREHOSE_LOG_PREFIX/'
TBLPROPERTIES ('has_encrypted_data'='false');
```

테이블이 만들어졌다면, 쌓인 데이터를 한번 확인해봅시다:

```sql
SELECT * FROM vingle_hands_on_lab.video_play_events LIMIT 10;
```

로그가 잘 쌓인것을 확인할 수 있습니다. 이제 우리가 보고싶었던 지표들을 한번 확인해볼까요?

비디오별 총 재생 시간 / 평균 재생 시간:

```sql

SELECT video_id, SUM(ended_at - started_at) AS total_play_duration, AVG(ended_at - started_at) AS avg_play_duration
FROM vingle_hands_on_lab.video_play_events
GROUP BY 1
ORDER BY 2
```

유저별 평균 연속재생 시간:

```sql
SELECT user_id, AVG(ended_at - started_at) AS duration
FROM vingle_hands_on_lab.video_play_events
GROUP BY 1
ORDER BY 2
```

특정 유저에 대한 플랫폼별 재생 세션 수 :

```sql
SELECT user_agent, COUNT(1) AS play_session_count
FROM vingle_hands_on_lab.video_play_events
WHERE user_id = 12345
GROUP BY 1
ORDER BY 2
```

### 쿼리한 결과 CSV로 내보내기

쿼리한 결과는 Results 패널 우상단의 문서 아이콘 (Downloads the results in CSV format) 을 클릭하시면 CSV로 즉시 다운로드가 가능합니다.


### 시각화

내보낸 CSV는 Excel, Tableau, Google Spreadsheet, Google Data Studio 와 같은 도구들로 시각화가 가능합니다.

여기서는 [Google Data Studio](https://datastudio.google.com/)를 이용해 간단히 CSV를 차트로 그려보도록 하겠습니다.

먼저, 비디오별 총 재생시간 / 평균 재생 시간을 쿼리한 결과를 CSV로 저장하세요.

[Google Data Studio](https://datastudio.google.com/)에 접속하고, 새 보고서 시작 -> 공백 을 선택합니다.

우하단의 `새 데이터 소스 만들기` 버튼을 클릭합니다.

리스트에 표시되는 커넥터 중, `파일 업로드`를 선택합니다.

저장했던 CSV 파일을 업로드합니다. 상태가 `처리 중`에서 `업로드됨`으로 변경되기까지 약 20초정도가 소요됩니다.

상태가 `업로드됨`으로 변경되면, 우상단의 `연결` 버튼이 활성화 됩니다. `연결` 버튼을 클릭하세요.

필드 데이터를 매핑할 수 있는 화면이 표시되는데, 우 상단의 `보고서에 추가` 버튼을 클릭하세요.

확인 다이얼로그가 표시되면, 다시 한번 `보고서에 추가` 버튼을 클릭합니다.

빈 보고서가 표시되면, 보고서 툴바의 `막대 그래프`를 선택하고 보고서의 빈 영역을 클릭합니다.

원하는 대로 측정 항목을 변경합니다.


## 리소스 삭제

추가적인 요금 과금을 방지하기 위해, 핸즈온을 진행하면서 생성된 리소스를 삭제하고자 하는 경우 다음을 순서대로 진행하세요:

### Athena 리소스 제거

1. [Athena Console](https://ap-northeast-2.console.aws.amazon.com/athena/home?region=ap-northeast-2)로 진입합니다.
2. 아래 SQL을 실행해 테이블을 제거합니다

```sql
DROP TABLE vingle_hands_on_lab.video_play_events;
```

3. 아래 SQL을 실행해 데이터베이스를 제거합니다

```sql
DROP DATABASE vingle_hands_on_lab;
```

### S3 Bucket 비우기

1. [S3 Console](https://ap-northeast-2.console.aws.amazon.com/s3/home?region=ap-northeast-2)로 진입합니다.
2. 표시되는 버킷 리스트에서 `${IDENTIFIER}-google-analytics` 이름을 가진 버킷을 찾습니다.
3. 다음과정에서 Identifier를 사용하기 때문에, Identifier는 미리 메모를 해 두세요.
4. 해당 버킷을 선택하고, Empty Bucket 버튼을 클릭합니다.
5. 버킷을 비우기 위해 버킷 이름을 한번 더 입력하는 다이얼로그가 뜨면, 버킷 이름을 한번 더 입력하고 Confirm 버튼을 클릭합니다.


### API Gateway / Lambda / Firehose

1. 터미널을 열고, 프로젝트 디렉토리로 이동합니다.
2. 아래 명령을 실행합니다. `${identifier}` 는 실습시 사용했던 identifier를 동일하게 사용하시면 됩니다.

```bash
$ node_modules/.bin/sls destroy -s prod -r ap-northeast-2 --identifier ${identifier}
```

그럼, 모든 리소스가 삭제됩니다!



[nodejs-windows-installer]: https://nodejs.org/dist/v8.11.4/node-v8.11.4-x86.msi
[nodejs-macos-installer]: https://nodejs.org/dist/v8.11.4/node-v8.11.4.pkg
[nodejs-linux-installer]: https://github.com/nodesource/distributions
[chrome-download]: https://www.google.com/chrome/
[webstorm-download]: http://www.jetbrains.com/webstorm/download/
[vscode-download]: https://code.visualstudio.com/download
[postman-download]: https://www.getpostman.com/apps
[aws-console]: https://console.aws.amazon.com/console/home?region=ap-northeast-2
[iam-console]: https://console.aws.amazon.com/iam/home?region=ap-northeast-2
