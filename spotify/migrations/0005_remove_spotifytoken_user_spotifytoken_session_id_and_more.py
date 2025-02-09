# Generated by Django 5.1.1 on 2025-01-07 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('spotify', '0004_alter_spotifytoken_access_token_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='spotifytoken',
            name='user',
        ),
        migrations.AddField(
            model_name='spotifytoken',
            name='session_id',
            field=models.CharField(default='', max_length=255, unique=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='access_token',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='spotifytoken',
            name='refresh_token',
            field=models.CharField(max_length=255),
        ),
    ]
