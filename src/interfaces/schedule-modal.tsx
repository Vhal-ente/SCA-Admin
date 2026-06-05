export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EventDataPayload {
  date: string;
  time: string;
  title: string;
  subTitle?: string;
  streamUrl?: string;
  mapInfo?: string;
  image?: string;
}

export interface StandardEventModalProps extends BaseModalProps {
  onConfirm?: (data?: any) => void;
  initialData?: EventDataPayload | null;
}

export interface ManageStreamModalProps extends BaseModalProps {
  initialData?: {
    title: string;
    subTitle: string;
    streamUrl: string;
    mapInfo: string;
  } | null;
  onUpdateStream?: (updatedData: any) => void;
}