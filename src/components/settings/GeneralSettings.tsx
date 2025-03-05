
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/contexts/SettingsContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Image, Upload, X, Loader2 } from "lucide-react";

const GeneralSettings = () => {
  const { settings, updateSettings } = useSettings();
  const [storeName, setStoreName] = useState(settings.storeName || "NextPOS");
  const [storeAddress, setStoreAddress] = useState(settings.storeAddress || "");
  const [storePhone, setStorePhone] = useState(settings.storePhone || "");
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Update local state when settings change
  useEffect(() => {
    setStoreName(settings.storeName || "NextPOS");
    setStoreAddress(settings.storeAddress || "");
    setStorePhone(settings.storePhone || "");
    setLogoUrl(settings.logoUrl || "");
  }, [settings.storeName, settings.storeAddress, settings.storePhone, settings.logoUrl]);
  
  const handleSave = async () => {
    try {
      await updateSettings({
        storeName,
        storeAddress,
        storePhone,
        logoUrl
      });
      toast.success("General settings updated");
    } catch (error) {
      toast.error("Failed to update general settings");
      console.error("Error updating general settings:", error);
    }
  };

  // Upload logo image
  const uploadLogo = async (file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `store-logos/${fileName}`;
      
      // Create an optimized version of the image using canvas
      const optimizedImage = await resizeAndOptimizeImage(file, 300);
      
      // Upload the optimized image to Supabase storage
      const { data, error } = await supabase.storage
        .from('pos-assets')
        .upload(filePath, optimizedImage, {
          contentType: file.type,
          upsert: true
        });
      
      if (error) {
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('pos-assets')
        .getPublicUrl(filePath);
      
      // Update the logoUrl state and settings
      setLogoUrl(urlData.publicUrl);
      await updateSettings({ logoUrl: urlData.publicUrl });
      
      toast.success("Logo uploaded successfully");
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Resize and optimize image before uploading
  const resizeAndOptimizeImage = (file: File, maxWidth: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          // Create canvas and draw the resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, 0, 0, width, height);
          
          // Convert to blob with 0.8 quality
          canvas.toBlob(
            (blob) => resolve(blob as Blob),
            file.type,
            0.8
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };
  
  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadLogo(e.target.files[0]);
    }
  };
  
  // Handle logo remove
  const handleRemoveLogo = async () => {
    try {
      // Extract the filename from the URL
      if (logoUrl) {
        const urlParts = logoUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `store-logos/${fileName}`;
        
        // Attempt to delete the file from storage
        await supabase.storage.from('pos-assets').remove([filePath]);
      }
      
      // Update settings to remove the logo URL
      setLogoUrl('');
      await updateSettings({ logoUrl: '' });
      
      toast.success("Logo removed");
    } catch (error) {
      console.error("Error removing logo:", error);
      // Even if storage deletion fails, still remove the URL from settings
      setLogoUrl('');
      await updateSettings({ logoUrl: '' });
    }
  };

  // Update store name in real-time
  const handleStoreNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStoreName(value);
    updateSettings({ storeName: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure general system settings for your POS.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="store-name">Store Name</Label>
          <Input 
            id="store-name" 
            placeholder="Enter your store name" 
            value={storeName}
            onChange={handleStoreNameChange}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="store-address">Store Address</Label>
          <Input 
            id="store-address" 
            placeholder="Enter your store address" 
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="store-phone">Store Phone</Label>
          <Input 
            id="store-phone" 
            placeholder="Enter your store phone" 
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <Label>Store Logo</Label>
          
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <div className="relative w-16 h-16 border rounded-md overflow-hidden">
                <img 
                  src={logoUrl} 
                  alt="Store logo" 
                  className="w-full h-full object-contain"
                />
                <button 
                  onClick={handleRemoveLogo}
                  className="absolute top-0 right-0 bg-destructive rounded-bl-md p-1"
                  type="button"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded-md bg-muted/20 border border-dashed">
                <Image className="w-6 h-6 text-muted-foreground/60" />
              </div>
            )}
            
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="logo-upload"
              />
              <Button 
                variant="outline" 
                size="sm"
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                Recommended size: 300×300px, max 2MB
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>
          Save General Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GeneralSettings;
