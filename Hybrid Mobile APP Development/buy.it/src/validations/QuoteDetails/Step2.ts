import * as yup from 'yup';

export const Step2FormSchema = yup.object().shape({
  nomeProduto: yup.string().required('Nome do produto é obrigatório.'),
  quantidade: yup
    .number()
    .required('Quantidade obrigatória.')
    .positive('Deve ser um número positivo.')
    .integer('Deve ser um número inteiro.')
    .min(1, 'Mín. 01 produto')
    .typeError('Informe a quantidade'),
  prazo: yup.string().required('Prazo é obrigatório'),
});
