from django.db import models

# Create your models here.
    
class SiteConfig(models.Model):
    banner = models.ImageField(upload_to="banners/", null=True, blank=True)

    col1_image = models.ImageField(upload_to="columns/", null=True, blank=True)
    col1_text = models.CharField(max_length=500, blank=True, default="")

    col2_image = models.ImageField(upload_to="columns/", null=True, blank=True)
    col2_text = models.CharField(max_length=500, blank=True, default="")

    col3_image = models.ImageField(upload_to="columns/", null=True, blank=True)
    col3_text = models.CharField(max_length=500, blank=True, default="")

    col4_image = models.ImageField(upload_to="columns/", null=True, blank=True)
    col4_text = models.CharField(max_length=500, blank=True, default="")