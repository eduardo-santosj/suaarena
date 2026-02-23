import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Plano {
  id: number;
  nome: string;
  treinos_por_semana: number;
}

interface SelectPlanoProps {
  value: string;
  planos: Plano[];
  onChange: (value: string) => void;
}

export const SelectPlano = ({ value, planos, onChange }: SelectPlanoProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um plano" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Nenhum plano</SelectItem>
        {planos.map((plano) => (
          <SelectItem key={plano.id} value={plano.id.toString()}>
            {plano.nome} - {plano.treinos_por_semana}x/semana
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};