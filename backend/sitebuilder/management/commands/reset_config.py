import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from sitebuilder.models import SiteConfig

class Command(BaseCommand):
    help = "Supprime la config du site et les images uploadées"

    def handle(self, *args, **options):
        SiteConfig.objects.all().delete()
        for folder in ["banners", "columns"]:
            shutil.rmtree(settings.MEDIA_ROOT / folder, ignore_errors=True)
        self.stdout.write(self.style.SUCCESS("Configuration réinitialisée."))