import { Modal, Form, Input, DatePicker, Button, message, Radio, Space } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { banUser } from '../api';
import type { BanUserModalProps } from '../model';
import dayjs, { type Dayjs } from 'dayjs';

const getBanUntilDate = (type: string, custom?: Dayjs | null): string => {
  if (type === 'permanent') {
    return dayjs('2099-12-31T23:59:59').format('YYYY-MM-DDTHH:mm:ss');
  }

  if (custom) {
    return custom.format('YYYY-MM-DDTHH:mm:ss');
  }

  const now = dayjs();
  switch (type) {
    case '1week':
      return now.add(1, 'week').format('YYYY-MM-DDTHH:mm:ss');
    case '2weeks':
      return now.add(2, 'weeks').format('YYYY-MM-DDTHH:mm:ss');
    case '1month':
      return now.add(1, 'month').format('YYYY-MM-DDTHH:mm:ss');
    case '6months':
      return now.add(6, 'months').format('YYYY-MM-DDTHH:mm:ss');
    default:
      return now.add(1, 'week').format('YYYY-MM-DDTHH:mm:ss');
  }
};

const BanUserModal = ({ username, visible, onClose, onSuccess }: BanUserModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = useCallback(async (values: { banReason: string; banType: string; customDate?: Dayjs }) => {
    if (!username) return;

    const banUntil = getBanUntilDate(values.banType, values.customDate);

    setLoading(true);
    try {
      await banUser({
        username,
        banReason: values.banReason,
        banUntil,
      });
      message.success('회원이 정지되었습니다.');
      onClose();
      onSuccess();
    } catch (error) {
      message.error(error instanceof Error ? error.message : '회원 정지에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [username, onClose, onSuccess]);

  return (
    <Modal
      title="회원 정지"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      transitionName=""
      maskTransitionName=""
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="정지 사유"
          name="banReason"
          rules={[{ required: true, message: '정지 사유를 입력해주세요.' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="정지 사유를 입력해주세요"
          />
        </Form.Item>

        <Form.Item
          label="정지 기간"
          name="banType"
          rules={[{ required: true, message: '정지 기간을 선택해주세요.' }]}
          initialValue="period"
        >
          <Radio.Group>
            <Space orientation="vertical">
              <Radio value="1week">1주</Radio>
              <Radio value="2weeks">2주</Radio>
              <Radio value="1month">한달</Radio>
              <Radio value="6months">반년</Radio>
              <Radio value="permanent">영구</Radio>
              <Radio value="period">직접 지정</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.banType !== currentValues.banType}
        >
          {({ getFieldValue }) =>
            getFieldValue('banType') === 'period' && (
              <Form.Item
                label="정지 종료일"
                name="customDate"
                rules={[{ required: true, message: '정지 종료일을 선택해주세요.' }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  className="w-full"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={onClose}>취소</Button>
            <Button type="primary" danger htmlType="submit" loading={loading}>
              정지
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BanUserModal;

