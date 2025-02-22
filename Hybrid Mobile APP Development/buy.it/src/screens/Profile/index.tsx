import { useState } from 'react';
import { ImageSourcePropType } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Checks } from 'phosphor-react-native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Toast from 'react-native-toast-message';

// Type import
import { MainNavigationRoutes } from '@routes/index';
import { UserQuery } from '@dtos/user';

// Hook import
import { useAuth } from '@hooks/useAuth';

// Validation import
import { SignInFormSchema as ProfileFormSchema } from '@validations/index';

// Theme import
import theme from '@theme/index';

// Component import
import {
  DecreasingContainer,
  Input,
  Button,
  DefaultComponent,
  UserAvatar,
  WrapperPage,
} from '@components/index';

// Style import
import { Fieldset } from './styles';
import { ScrollableContent } from '@global/styles/index';

interface ProfileForm {
  email: string;
  senha: string;
}

export function Profile({
  navigation,
}: NativeStackScreenProps<MainNavigationRoutes, 'Profile'>) {
  // Hook
  const { user, handleUpdateUser } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: yupResolver(ProfileFormSchema),
    defaultValues: {
      email: user.email,
      senha: user.senha,
    },
  });

  // State
  const [avatar, setAvatar] = useState<string | null>(user?.urlImagem);

  const onSubmit: SubmitHandler<ProfileForm> = async data => {
    try {
      if (!avatar)
        return Toast.show({
          type: 'error',
          text1: 'Adicione uma imagem',
          text2: 'Sua identidade visual é importante.',
        });

      const idsTags = user.tags.map(item => item.id);

      const userUpdated: UserQuery = Object.assign(user, {
        idsTags,
        urlImagem: avatar,
        ...data,
      });

      await handleUpdateUser(userUpdated);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível atualizar sua conta.',
      });
    }
  };

  const imageSource: ImageSourcePropType = avatar
    ? { uri: avatar }
    : require('../../assets/default_avatar.png');

  return (
    <WrapperPage>
      <ScrollableContent>
        <DefaultComponent
          highlightProps={{
            title: 'Gerencie sua conta',
            subtitle: `Olá, ${user.nome}!`,
          }}
          headerProps={{ goBack: () => navigation.goBack() }}
          key="default-component-profile"
        />

        <DecreasingContainer>
          <UserAvatar
            imageSource={imageSource}
            handleSetAvatar={setAvatar}
            size="MD"
          />

          <Fieldset>
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  label="E-mail"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Johndoe@example.com"
                  error={errors.email?.message}
                />
              )}
            />
          </Fieldset>

          <Fieldset style={{ paddingBottom: 75 }}>
            <Controller
              control={control}
              name="senha"
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  label="Senha"
                  placeholder="****"
                  secureTextEntry
                  error={errors.senha?.message}
                />
              )}
            />
          </Fieldset>
        </DecreasingContainer>
      </ScrollableContent>

      <Button
        label="Salvar"
        size="XL"
        icon={<Checks color={theme.COLORS.WHITE} weight="bold" />}
        bottom
        onPress={handleSubmit(onSubmit)}
      />
    </WrapperPage>
  );
}
