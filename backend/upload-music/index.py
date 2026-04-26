"""
Скачивает романтическую музыку и загружает в S3 для свадебного сайта
"""
import json
import os
import urllib.request
import boto3


def handler(event: dict, context) -> dict:
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    # Шопен Ноктюрн Op.9 No.2 — публичный домен, Wikimedia Commons (MP3)
    music_url = 'https://upload.wikimedia.org/wikipedia/commons/8/82/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3'
    s3_key = 'music/wedding-nocturne.mp3'

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )

    # Проверяем — вдруг уже загружен
    try:
        s3.head_object(Bucket='files', Key=s3_key)
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': json.dumps({'ok': True, 'url': cdn_url, 'cached': True}),
        }
    except Exception:
        pass

    # Скачиваем и кладём в S3
    req = urllib.request.Request(music_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=25) as resp:
        audio_data = resp.read()

    s3.put_object(
        Bucket='files',
        Key=s3_key,
        Body=audio_data,
        ContentType='audio/mpeg',
    )

    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': json.dumps({'ok': True, 'url': cdn_url}),
    }