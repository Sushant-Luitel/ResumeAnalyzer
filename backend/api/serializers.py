from rest_framework import serializers
from .models import CustomUser,FileUpload
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields=['username','password','first_name','last_name',]
        extra_kwargs= {'password':{'write_only':True}}

    def create(self,validated_data):
        user=CustomUser(
            username=validated_data['username'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ['file']  # Do not include 'user' field

    def create(self, validated_data):
        user = self.context['user']  # Get user from context
        return FileUpload.objects.create(user=user, **validated_data)

