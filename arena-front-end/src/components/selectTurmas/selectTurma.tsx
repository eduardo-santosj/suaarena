
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Turma } from "@/types/model/turma";

interface SelectTurmaProps {
  onChange: (value: string) => void;
  turmas?: Turma[];  // array de turmas, pode ser undefined no carregamento
  value?: string; // valor selecionado, pode ser undefined
}

export function SelectTurma({ onChange, turmas, value }: Readonly<SelectTurmaProps>) {

const turmasGet = turmas?.map((turma) => ({
    id: turma.id.toString(),
    name: turma.nome,
  }));
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Turma" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Turma</SelectLabel>
          <SelectItem value='todos'>Todas</SelectItem>
          {turmasGet?.map(turma => (
            <SelectItem key={turma?.id} value={turma?.id?.toString()}>
              {turma?.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}