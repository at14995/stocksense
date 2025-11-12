
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile, deleteUserAccount } from '@/lib/profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { doc } from 'firebase/firestore';


function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc(userDocRef);


  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth');
    }
  }, [user, isUserLoading, router]);

  // This effect now ONLY runs when the profile data initially loads or changes from the backend.
  // It no longer depends on local state variables like `displayName` or `phoneNumber`.
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phoneNumber || '');
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!user || !displayName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Nickname cannot be empty.',
      });
      return;
    }
    if (phoneNumber && !/^\+[1-9]\d{1,14}$/.test(phoneNumber)) {
        toast({
            variant: 'destructive',
            title: 'Validation Error',
            description: 'Please enter a valid phone number in E.164 format (e.g., +15551234567).',
        });
        return;
    }


    setIsSaving(true);
    try {
      await updateUserProfile(firestore, auth, user.uid, { displayName, phoneNumber });
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to update profile.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirm !== 'DELETE') {
        toast({
            variant: 'destructive',
            title: 'Confirmation Error',
            description: 'Please type DELETE to confirm.',
        });
        return;
    }
    setIsDeleting(true);
    try {
      await deleteUserAccount(firestore, auth, user.uid);
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete account.',
      });
      setIsDeleting(false);
    }
  };
  
  if (isUserLoading || !user || isProfileLoading) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  const isProfileChanged = displayName !== (userProfile?.displayName ?? '') || phoneNumber !== (userProfile?.phoneNumber ?? '');

  return (
    <main className="flex justify-center items-start min-h-screen px-4 py-20 bg-transparent">
      <div className="max-w-3xl w-full bg-[#0E0E12]/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile and account settings.</p>
        </div>

        {/* Profile Settings */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Profile</h2>
          <div className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="displayName">Nickname</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
               <div className="flex items-center gap-2">
                 <Input
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="max-w-xs"
                    placeholder="+15551234567"
                  />
                  {userProfile?.phoneVerified ? (
                    <span className="flex items-center gap-1 text-sm text-green-400"><CheckCircle className="h-4 w-4" /> Verified</span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-amber-400"><AlertTriangle className="h-4 w-4" /> Not Verified</span>
                  )}
              </div>
               <p className="text-xs text-muted-foreground">Used for SMS and WhatsApp alerts. Verification coming soon.</p>
            </div>
          </div>
           <Button onClick={handleSaveProfile} disabled={isSaving || !isProfileChanged}>
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
        </div>

        <Separator />

        {/* Danger Zone */}
        <div className="space-y-4 p-4 border border-destructive/50 rounded-lg bg-destructive/10">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-destructive/80">Permanently delete your account and all associated data. This action is irreversible.</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account, watchlists, alerts, and all other data.
                    To confirm, please type <strong>DELETE</strong> below.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                    <Input 
                        id="delete-confirm"
                        placeholder="Type DELETE to confirm"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} disabled={isDeleting || deleteConfirm !== 'DELETE'}>
                     {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Deletion'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </main>
  );
}

export default SettingsPage;

    