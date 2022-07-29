import { FC, ReactNode } from 'react';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  chakra,
  useBreakpointValue,
} from '@chakra-ui/react';
import dayjs, { Dayjs } from 'dayjs';
import DayPicker, { DayPickerProps } from 'react-day-picker';
import ReactFocusLock from 'react-focus-lock';

import i18n from '@/config/i18next';

import { useDateSelectorContext } from './DateSelector';

type ChildrenFunctionParams = { date: Dayjs; onOpen: () => void };
type DateSelectorPickerProps = Omit<DayPickerProps, 'children'> & {
  children?({ date, onOpen }: ChildrenFunctionParams): ReactNode;
};
const defaultChildren = ({ date, onOpen }: ChildrenFunctionParams) => (
  <chakra.button onClick={onOpen} px="2" type="button">
    {date.locale(i18n.language).format('DD MMM YYYY')}
  </chakra.button>
);

export const DateSelectorPicker: FC<DateSelectorPickerProps> = ({
  children = defaultChildren,
  ...rest
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const { date, onDayClick, isOpen, onOpen, onClose } =
    useDateSelectorContext();

  const dayPicker = (
    <DayPicker
      locale={i18n.language}
      initialMonth={date.toDate()}
      selectedDays={[date.toDate()]}
      onDayClick={(d) => onDayClick(dayjs(d))}
      months={Array.from({ length: 12 }).map((_, i) =>
        dayjs().month(i).format('MMMM')
      )}
      weekdaysLong={Array.from({ length: 7 }).map((_, i) =>
        dayjs().day(i).format('dddd')
      )}
      weekdaysShort={Array.from({ length: 7 }).map((_, i) =>
        dayjs().day(i).format('dd')
      )}
      firstDayOfWeek={1}
      {...rest}
    />
  );

  if (isMobile) {
    return (
      <>
        {children({ date, onOpen })}
        <Modal isOpen={isOpen} onClose={onClose} size="xs">
          <ModalOverlay />
          <ModalContent>
            <ModalBody>{dayPicker}</ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>{children({ date, onOpen })}</PopoverTrigger>
      <PopoverContent
        minW="0"
        p="0"
        my="2"
        border="none"
        boxShadow="none"
        width="min-content"
      >
        <ReactFocusLock>
          <PopoverBody
            p="0"
            border="1px solid"
            borderRadius="md"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.900' }}
          >
            {dayPicker}
          </PopoverBody>
        </ReactFocusLock>
      </PopoverContent>
    </Popover>
  );
};
