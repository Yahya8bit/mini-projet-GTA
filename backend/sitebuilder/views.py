from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import SiteConfig
from .serializers import SiteConfigSerializer

class SiteConfigView(APIView):
    # MultiPartParser = accepter le FormData (fichiers), comme UploadFile en FastAPI
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = []   # API publique : pas de session → pas de check CSRF
    permission_classes = []

    def get_object(self):
        # Une seule config pour tout le site : on la crée si elle n'existe pas
        obj, _ = SiteConfig.objects.get_or_create(pk=1)
        return obj

    def get(self, request):          # ≈ @app.get("/config")
        config = self.get_object()
        serializer = SiteConfigSerializer(config, context={"request": request})
        return Response(serializer.data)

    def put(self, request):          # ≈ @app.put("/config")
        config = self.get_object()
        # partial=True : le client peut n'envoyer que les champs modifiés
        serializer = SiteConfigSerializer(
            config, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)  # ≈ validation Pydantic automatique
        serializer.save()
        return Response(serializer.data)