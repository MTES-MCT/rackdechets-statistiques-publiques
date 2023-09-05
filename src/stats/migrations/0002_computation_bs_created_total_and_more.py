# Generated by Django 4.2.4 on 2023-08-22 13:24

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("stats", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="computation",
            name="bs_created_total",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsda_counts_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsda_quantities_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsdasri_counts_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsdasri_quantities_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsdd_counts_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsdd_quantities_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="bsff_counts_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="company_counts_by_category",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="company_created_total_life",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="company_created_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="produced_quantity_by_category",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="quantity_processed_sunburst_figure",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="quantity_processed_total",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="quantity_processed_weekly",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="user_created_total_life",
            field=models.JSONField(default=dict),
        ),
        migrations.AddField(
            model_name="computation",
            name="user_created_weekly",
            field=models.JSONField(default=dict),
        ),
    ]
