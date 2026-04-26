"""
Отправка ответа гостя невесте в ВКонтакте
"""
import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    guest_name = body.get('name', 'Гость')
    attendance = body.get('attendance', '')
    guests_count = body.get('guests_count', 1)
    message_text = body.get('message', '')

    attendance_label = {
        'yes': '✅ Придёт',
        'no': '❌ Не придёт',
        'maybe': '🤔 Возможно придёт',
    }.get(attendance, attendance)

    text = (
        f"💌 Новый ответ на свадебное приглашение!\n\n"
        f"👤 Имя: {guest_name}\n"
        f"📋 Ответ: {attendance_label}\n"
        f"👥 Кол-во гостей: {guests_count}\n"
    )
    if message_text:
        text += f"💬 Пожелание: {message_text}"

    token = os.environ.get('VK_ACCESS_TOKEN', '')
    vk_user_id = 'sonechka_nss'

    if not token:
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'ok': True, 'warning': 'VK token not set, message not sent'}),
        }

    # Сначала получаем числовой user_id по screen_name
    resolve_url = (
        'https://api.vk.com/method/utils.resolveScreenName'
        f'?screen_name={vk_user_id}&access_token={token}&v=5.199'
    )
    with urllib.request.urlopen(resolve_url, timeout=10) as resp:
        resolve_data = json.loads(resp.read())

    user_id = resolve_data.get('response', {}).get('object_id')
    if not user_id:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': 'Cannot resolve VK user ID'}),
        }

    params = urllib.parse.urlencode({
        'user_id': user_id,
        'message': text,
        'random_id': 0,
        'access_token': token,
        'v': '5.199',
    })
    send_url = f'https://api.vk.com/method/messages.send?{params}'
    with urllib.request.urlopen(send_url, timeout=10) as resp:
        result = json.loads(resp.read())

    if 'error' in result:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'ok': False, 'error': result['error']}),
        }

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'ok': True}),
    }
