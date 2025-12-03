'use client';

import type ITaskItem from 'src/types/task';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { fData } from 'src/utils/format-number';

import { useTaskStore } from 'src/store/taskStore';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type UpdateTaskSchemaType = zod.infer<typeof UpdateTaskSchema>;

// Match ITaskItem fields where applicable: title, description, status, reward, location
export const UpdateTaskSchema = zod.object({
  title: zod.string().min(1, { message: 'Title is required!' }),
  description: zod.string().optional().nullable(),
  status: zod
    .enum(['open', 'assigned', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  reward: zod.preprocess((val) => {
    if (val === '' || val == null) return undefined;
    return Number(val);
  }, zod.number().optional().nullable()),
  location: zod.preprocess((val) => (val === '' ? undefined : val), zod.any().optional().nullable()),
  // Keep an optional photo field for task image (avatar component remains)
  photoURL: zod.any().optional().nullable(),
});

// ----------------------------------------------------------------------



type TaskGeneralProps = {
  task?: ITaskItem;
};

export function TaskGeneral({ task }: TaskGeneralProps) {
  const tasks = useTaskStore((state) => state.tasks);

  // If task prop is provided, try to find the latest from store by id
  const storeTask = useMemo(() => {
    if (task?.id) {
      return tasks.find((t) => t.id === task.id) || task;
    }
    return undefined;
  }, [task, tasks]);

  // Pick a random avatar/image if missing (keep avatar component intact)
  function getAvatarUrl(item: any) {
    if (item?.imageUrl) return item.imageUrl;
    const randomIndex = Math.floor(Math.random() * 12) + 1;
    return `/assets/images/mock/avatar/avatar-${randomIndex}.webp`;
  }

  // Normalize values so inputs don't receive `null` (React warns when `value` is null)
  const currentTask: UpdateTaskSchemaType = (storeTask
    ? {
        title: storeTask.title,
        description: storeTask.description || '',
        status: (storeTask.status as any) || 'open',
        // keep reward as number when present, otherwise empty string for the input
        reward: (storeTask.reward ?? '') as any,
        // location shown as string input (JSON) or empty string
        location: (storeTask.location ?? '') as any,
        photoURL: getAvatarUrl(storeTask),
      }
    : {
        title: '',
        description: '',
        status: 'open',
        reward: '' as any,
        location: '' as any,
        photoURL: undefined,
      }) as UpdateTaskSchemaType;

  // const defaultValues: UpdateTaskSchemaType = {
  //   title: '',
  //   description: '',
  //   status: 'open',
  //   reward: '' as any,
  //   location: '' as any,
  //   photoURL: undefined,
  // };

  const methods = useForm<UpdateTaskSchemaType>({
    mode: 'all',
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: currentTask,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <Field.UploadAvatar
              name="photoURL"
              value={getAvatarUrl(currentTask)}
              maxSize={3145728}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  Allowed *.jpeg, *.jpg, *.png, *.gif
                  <br /> max size of {fData(3145728)}
                </Typography>
              }
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              Delete task
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
              <Box
                sx={{
                  rowGap: 3,
                  columnGap: 2,
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                }}
              >
                <Field.Text name="title" label="Title" />
                <Field.Text name="reward" label="Reward" type="number" />

                <Field.Select name="status" label="Status">
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="assigned">Assigned</MenuItem>
                  <MenuItem value="in_progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Field.Select>

                <Field.Text name="location" label="Location (JSON)" />
              </Box>

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Field.Text name="description" multiline rows={4} label="Description" />

              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>

    </Form>
  );
}
