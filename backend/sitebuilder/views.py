from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import SiteConfig
from .serializers import SiteConfigSerializer

class SiteConfigView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = []  
    permission_classes = []

    def get_object(self):
        obj, _ = SiteConfig.objects.get_or_create(pk=1)
        return obj

    def get(self, request):          
        config = self.get_object()
        serializer = SiteConfigSerializer(config, context={"request": request})
        return Response(serializer.data)

    def put(self, request):          
        config = self.get_object()
        
        serializer = SiteConfigSerializer(
            config, data=request.data, partial=True, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)  
        serializer.save()
        return Response(serializer.data)