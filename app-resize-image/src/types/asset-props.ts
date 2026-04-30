export type AssetProps = {
  sys: any;
  fields: {
    /** Title for this asset */
    title: {
      [key: string]: string;
    };
    /** Description for this asset */
    description?: {
      [key: string]: string;
    };
    /** File object for this asset */
    file: {
      [key: string]: {
        fileName: string;
        contentType: string;
        /** Url where the file is available to be downloaded from, into the Contentful asset system. After the asset is processed this field is gone. */
        upload?: string;
        /** Url where the file is available at the Contentful media asset system. This field won't be available until the asset is processed. */
        url?: string;
        /** Details for the file, depending on file type (example: image size in bytes, etc) */
        details?: Record<string, any>;
        uploadFrom?: Record<string, any>;
      };
    };
  };
  metadata?: any;
};
