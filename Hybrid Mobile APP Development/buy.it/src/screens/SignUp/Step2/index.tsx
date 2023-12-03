// Component import
import {
  DecreasingContainer,
  Input,
  Button,
  Chip,
  DefaultComponent,
  CustomDropdown
} from "@components/index";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";
import { ArrowRight } from "phosphor-react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// Type import
import { MainNavigationRoutes } from "@routes/index";
import { SignUpRoutes } from "..";

// Validation import
import { Step2FormSchema } from "@validations/index";

// Theme import
import theme from "@theme/index";

// Util import
import { toMaskedCNPJ, unMask } from "@utils/masks";

// Hook import
import { useSignUpForm } from "@hooks/useSignUpForm";

// Style import
import { Container, Fieldset, WrapChip } from './styles';
import { useState } from "react";

interface Step2Form {
  nome: string;
  cnpj: string;
}

const departmentsExample = [
  { label: 'Escritório', value: 1 },
  { label: 'Informática', value: 2 },
  { label: 'Têxtil', value: 3 },
]

const tagsExample = [
  { label: 'Periféricos', value: 1 },
  { label: 'Eletrônicos', value: 2 },
  { label: 'Papelaria', value: 3 },
  { label: 'Roupas e acessórios', value: 4 },
  { label: 'Tecidos', value: 5 },
]

export const Step2: React.FC<
  CompositeScreenProps<
    NativeStackScreenProps<SignUpRoutes, 'Step2'>,
    NativeStackScreenProps<MainNavigationRoutes>
  >
> = ({ navigation }) => {
  // Hook
  const { user, setUser } = useSignUpForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2Form>({
    resolver: yupResolver(Step2FormSchema),
  });

  const onSubmit: SubmitHandler<Step2Form> = (data) => {
    const cleanCNPJ = unMask(data.cnpj);
    Object.assign(data, { cnpj: cleanCNPJ });

    setUser({ ...user, ...data });

    return navigation.navigate("Step3");
  }

  // State
  const [department, setDepartment] = useState(1);
  const [tags, setTags] = useState([1]);

  return (
    <Container>
      <DefaultComponent
        headerProps={{ goBack: () => navigation.goBack() }}
        highlightProps={{
          title: "Dados da",
          subtitle: "Passo 2 de 5",
          highlightedText: "empresa"
        }}
        key="default-component-step1"
      />

      <DecreasingContainer>
        <Fieldset>
          <Controller
            control={control}
            name="nome"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                label="Nome da empresa"
                placeholder="Carrefour"
                error={errors.nome?.message}
              />
            )}
          />
        </Fieldset>

        <Fieldset>
          <Controller
            control={control}
            name="cnpj"
            render={({ field: { value, onChange } }) => (
              <Input
                value={value}
                onChangeText={(text) => onChange(toMaskedCNPJ(text))}
                label="CNPJ"
                placeholder="00.000.000/0001-00"
                keyboardType="numeric"
                error={errors.cnpj?.message}
              />
            )}
          />

        </Fieldset>

        <Fieldset>
          <CustomDropdown 
            label="Departamento"
            placeholder="Selecione uma opção"
            options={departmentsExample}
            selectedValue={department}
            onValueChange={(value: number) => setDepartment(value)}
          />
        </Fieldset>

        <Fieldset>
          <CustomDropdown 
            label="Tags relacionadas"
            placeholder="Selecione uma opção"
            options={tagsExample}
            selectedValue={tags}
            isMultiple
            isSearchable
            onValueChange={(value: any) => setTags(value)}
          />
        </Fieldset>

        {/* <Input label="Tags relacionadas" placeholder="Papelaria" />
        <WrapChip>
          <Chip value="material escolar" removable />
          <Chip value="suprimento" removable />
          <Chip value="papelaria" removable />
        </WrapChip> */}

      </DecreasingContainer>

      <Button
        label="Continuar"
        size="XL"
        icon={<ArrowRight color={theme.COLORS.WHITE} weight="bold" />}
        bottom
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
