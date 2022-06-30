import React, { useEffect, useState } from "react";
import {
  Checkbox,
  Flex,
  HelpText,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@contentful/f36-components";
import { FieldExtensionSDK } from "@contentful/app-sdk";
import { /* useCMA, */ useSDK } from "@contentful/react-apps-toolkit";
import * as icons from "@contentful/f36-icons";
import tokens from "@contentful/f36-tokens";

interface FormTypeConfigParameters {
  serviceList: string;
  maxServiceSelected: number;
}

interface FormTypeConfigValue {
  [key: string]: {
    enabled: boolean;
    data: {
      [key: string]: string;
    };
  };
}

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const instanceParameters = sdk.parameters
    .instance as FormTypeConfigParameters;

  const [value, setValue] = useState<FormTypeConfigValue>({});
  const [serviceList, setServiceList] = useState<string[]>([]);

  const [detachExternalChangeHandler, setDetachExternalChangeHandler] =
    useState<Function | null>(null);

  useEffect(() => {
    sdk.window.startAutoResizer();
    setDetachExternalChangeHandler(
      sdk.field.onValueChanged(handleExternalValueChange)
    );

    if (
      instanceParameters &&
      instanceParameters.serviceList &&
      instanceParameters.serviceList.length
    ) {
      const serviceListArray = instanceParameters.serviceList
        .split(",")
        .filter((text) => text !== "");
      setServiceList(serviceListArray);

      const contentfulValues: FormTypeConfigValue = sdk.field?.getValue() || {};
      const initialValues: FormTypeConfigValue = {};

      /* In order to preserve all the data, we check for all the keys in the service list provided by the instance
       * parameters and all the keys in the current data object, disabling any field configuration that is stored in
       * the value but has been removed from the instance parameter definitions. */

      const initialValuesKeys = Object.keys(contentfulValues);
      const allServices = Array.from(
        new Set([...serviceListArray, ...initialValuesKeys])
      );

      for (const service of allServices) {
        if (contentfulValues[service]) {
          if (serviceListArray.includes(service)) {
            initialValues[service] = contentfulValues[service];
          } else {
            initialValues[service] = {
              enabled: false,
              data: contentfulValues[service].data,
            };
          }
        } else {
          initialValues[service] = {
            enabled: false,
            data: {},
          };
        }
      }
      setValue(initialValues);
    }
    return () => {
      if (
        detachExternalChangeHandler &&
        typeof detachExternalChangeHandler === "function"
      )
        detachExternalChangeHandler();
    };
    //eslint-disable-next-line
  }, []);

  const openConfigDialog = (serviceName: string) => {
    sdk.dialogs
      .openCurrentApp({
        title: `${serviceName} Variables`,
        width: "large",
        minHeight: "80vh",
        parameters: value[serviceName]?.data || {},
      })
      .then((dialogData) => {
        if (dialogData) {
          const newValue = {
            ...value,
            [serviceName]: {
              enabled: value[serviceName]?.enabled || false,
              data: dialogData,
            },
          };
          handleValueChange(newValue);
        }
      });
  };

  const handleCheckboxChange = (event: any, service: string) => {
    const newValue = {
      ...value,
      [service]: {
        enabled: !value[service].enabled,
        data: value[service].data,
      },
    };
    handleValueChange(newValue);
  };

  const handleValueChange = (newValue: FormTypeConfigValue) => {
    setValue(newValue);
    if (!newValue) {
      sdk.field.removeValue().then();
    } else {
      sdk.field.setValue(newValue).then();
    }
  };

  const handleExternalValueChange = (newValue: FormTypeConfigValue) => {
    setValue(newValue);
  };

  const maxServices: number = instanceParameters?.maxServiceSelected || 1;

  return (
    <Flex flexDirection={"column"}>
      <Table>
        <TableBody>
          {serviceList.map((service) => {
            return (
              <TableRow key={service}>
                <TableCell>
                  <Checkbox
                    style={{ paddingTop: tokens.spacingS }}
                    onChange={(event) => handleCheckboxChange(event, service)}
                    isChecked={value[service].enabled}
                    id={service}
                    isDisabled={
                      Object.values(value).reduce(
                        (enabledCount, current) =>
                          current.enabled ? ++enabledCount : enabledCount,
                        0
                      ) >= maxServices && !value[service].enabled
                    }
                  >
                    {service}
                  </Checkbox>
                </TableCell>
                <TableCell align={"right"}>
                  <IconButton
                    onClick={() => openConfigDialog(service)}
                    aria-label="Configure service variables"
                    icon={<icons.SettingsIcon />}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <HelpText style={{ fontStyle: "italic", marginTop: tokens.spacingS }}>
        Can activate a maximum of {maxServices} configuration{maxServices > 1 ? 's' : ''}
      </HelpText>
    </Flex>
  );
};

export default Field;
