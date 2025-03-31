"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { ClipLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Policy } from "./PolicyTable";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { Id } from "../../convex/_generated/dataModel";
import Link from "next/link";

const EditPolicy = ({ policy }: { policy: Policy }) => {
  const router = useRouter();
  const [policyDocuments, setPolicyDocuments] = useState<File | undefined>(
    undefined
  );
  const [customerDocuments, setCustomerDocuments] = useState<File | undefined>(
    undefined
  );
  const [vehicleModels, setVehicleModels] = useState<string[] | undefined>([]);
  const [addModel, setAddModel] = useState<boolean>(false);
  const editPolicy = policy;
  const uploadUrl = useMutation(api.policies.generateUploadUrl);

  useEffect(() => {
    const fetchPolicy = async () => {
      const models = await fetchQuery(api.vehicles.getVehicleModels);

      const modelNames = models.map((model) => model.name);
      setVehicleModels(modelNames);
    };
    fetchPolicy();
  }, [editPolicy._id]);

  const formSchema = z.object({
    date: z.date({ required_error: "Please fill Date!" }),
    registeredOwnerName: z
      .string()
      .nonempty({ message: "Please fill Registered Owner Name!" }),
    vehicleUsedOwnerName: z
      .string()
      .nonempty({ message: "Please fill Vehicle Used Owner Name!" }),
    policyEndDate: z.date({ required_error: "Please fill Policy End Date!" }),
    vehicleManufacturingYear: z
      .string()
      .nonempty({ message: "Please fill Vehicle Manufacturing Year!" }),
    vehicleRegistrationNumber: z
      .string()
      .nonempty({ message: "Please fill Vehicle Registration Number!" }),
    customerMobileNumber: z
      .string()
      .length(10, { message: "Mobile number should be 10 digits" }),
    vehicleModel: z
      .string()
      .nonempty({ message: "Please fill Vehicle Model!" }),
    anyVehicleWork: z
      .string()
      .nonempty({ message: "Please fill Any Vehicle Work!" }),
    insuranceCompany: z
      .string()
      .nonempty({ message: "Please fill Insurance Company!" }),
    insuranceAgency: z
      .string()
      .nonempty({ message: "Please fill Insurance Agency!" }),
    totalPremium: z
      .string()
      .nonempty({ message: "Please fill Total Premium!" }),
    netPremium: z.string().nonempty({ message: "Please fill Net Premium!" }),
    idv: z.string().nonempty({ message: "Please fill IDV!" }),
    cmCollectAmount: z
      .string()
      .nonempty({ message: "Please fill CM Collect Amount!" }),
    paidAgency: z.string().nonempty({ message: "Please fill Paid Agency!" }),
    agentPayout: z.string().nonempty({ message: "Please fill Agent Payout!" }),
    netPayout: z.string().nonempty({ message: "Please fill Net Payout!" }),
    directCmorAgent: z
      .string()
      .nonempty({ message: "Please fill Direct CM or Agent!" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(editPolicy.date),
      registeredOwnerName: editPolicy.registeredOwnerName,
      vehicleUsedOwnerName: editPolicy.vehicleUsedOwnerName,
      policyEndDate: new Date(editPolicy.policyEndDate),
      vehicleManufacturingYear: editPolicy.vehicleManufacturingYear,
      vehicleRegistrationNumber: editPolicy.vehicleRegistrationNumber,
      customerMobileNumber: editPolicy.customerMobileNumber,
      vehicleModel: editPolicy.vehicleModel,
      anyVehicleWork: editPolicy.anyVehicleWork,
      insuranceCompany: editPolicy.insuranceCompany,
      insuranceAgency: editPolicy.insuranceAgency,
      totalPremium: editPolicy.totalPremium.toString(),
      netPremium: editPolicy.netPremium.toString(),
      idv: editPolicy.idv.toString(),
      cmCollectAmount: editPolicy.cmCollectAmount.toString(),
      paidAgency: editPolicy.paidAgency.toString(),
      agentPayout: editPolicy.agentPayout.toString(),
      netPayout: editPolicy.netPayout.toString(),
      directCmorAgent: editPolicy.directCmorAgent,
    },
  });

  const checkChanged = (): boolean => {
    if (policyDocuments || customerDocuments) return true;
    if (
      form.getValues().date.toISOString() !==
      new Date(editPolicy.date).toISOString()
    ) {
      console.log(1);
      return true;
    }
    if (
      form.getValues().registeredOwnerName !== editPolicy.registeredOwnerName
    ) {
      console.log(2);
      return true;
    }
    if (
      form.getValues().vehicleUsedOwnerName !== editPolicy.vehicleUsedOwnerName
    ) {
      console.log(3);
      return true;
    }
    if (
      form.getValues().policyEndDate.toISOString() !==
      new Date(editPolicy.policyEndDate).toISOString()
    ) {
      console.log(4);
      return true;
    }
    if (
      form.getValues().vehicleManufacturingYear !==
      editPolicy.vehicleManufacturingYear
    ) {
      console.log(5);
      return true;
    }
    if (
      form.getValues().vehicleRegistrationNumber !==
      editPolicy.vehicleRegistrationNumber
    ) {
      console.log(6);
      return true;
    }
    if (
      form.getValues().customerMobileNumber !== editPolicy.customerMobileNumber
    ) {
      console.log(7);
      return true;
    }
    if (form.getValues().vehicleModel !== editPolicy.vehicleModel) {
      console.log(8);
      return true;
    }
    if (form.getValues().anyVehicleWork !== editPolicy.anyVehicleWork) {
      console.log(9);
      return true;
    }
    if (form.getValues().insuranceCompany !== editPolicy.insuranceCompany) {
      console.log(10);
      return true;
    }
    if (form.getValues().insuranceAgency !== editPolicy.insuranceAgency) {
      console.log(11);
      return true;
    }
    if (form.getValues().totalPremium !== editPolicy.totalPremium.toString()) {
      console.log(12);
      return true;
    }
    if (form.getValues().netPremium !== editPolicy.netPremium.toString()) {
      console.log(13);
      return true;
    }
    if (form.getValues().idv !== editPolicy.idv.toString()) {
      console.log(14);
      return true;
    }
    if (
      form.getValues().cmCollectAmount !== editPolicy.cmCollectAmount.toString()
    ) {
      console.log(15);
      return true;
    }
    if (form.getValues().paidAgency !== editPolicy.paidAgency.toString()) {
      console.log(16);
      return true;
    }
    if (form.getValues().agentPayout !== editPolicy.agentPayout.toString()) {
      console.log(17);
      return true;
    }
    if (form.getValues().netPayout !== editPolicy.netPayout.toString()) {
      console.log(18);
      return true;
    }
    if (
      form.getValues().directCmorAgent !== editPolicy.directCmorAgent.toString()
    ) {
      console.log(19);
      return true;
    }

    return false;
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!checkChanged()) {
        toast.error("You have to make changes to save");
        return;
      } else {
        let newFile = false;
        let newCustomerFile = false;
        let policyStorage_id: Id<"_storage"> | "" = editPolicy.storageId;
        let customerStorage_id: Id<"_storage"> | "" =
          editPolicy.customerStorageId;
        if (policyDocuments) {
          const url = await uploadUrl();
          const result = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": policyDocuments.type,
            },
            body: policyDocuments,
          });
          const { storageId } = await result.json();
          policyStorage_id = storageId;
          newFile = true;
        }
        if (customerDocuments) {
          const url = await uploadUrl();
          const result = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": customerDocuments.type,
            },
            body: customerDocuments,
          });
          const { storageId } = await result.json();
          customerStorage_id = storageId;
          newCustomerFile = true;
        }

        const id = editPolicy._id! as Id<"policies">;

        const date = new Date(values.date).toISOString();
        const endDate = new Date(values.policyEndDate).toISOString();

        await fetchMutation(api.policies.updatePolicy, {
          id,
          date,
          registeredOwnerName: values.registeredOwnerName,
          vehicleUsedOwnerName: values.vehicleUsedOwnerName,
          policyEndDate: endDate,
          vehicleManufacturingYear: values.vehicleManufacturingYear,
          vehicleRegistrationNumber: values.vehicleRegistrationNumber,
          customerMobileNumber: values.customerMobileNumber,
          vehicleModel: values.vehicleModel,
          anyVehicleWork: values.anyVehicleWork,
          insuranceCompany: values.insuranceCompany,
          insuranceAgency: values.insuranceAgency,
          totalPremium: values.totalPremium ? parseInt(values.totalPremium) : 0,
          netPremium: values.netPremium ? parseInt(values.netPremium) : 0,
          idv: values.idv ? parseInt(values.idv) : 0,
          cmCollectAmount: values.cmCollectAmount
            ? parseInt(values.cmCollectAmount)
            : 0,
          paidAgency: values.paidAgency ? parseInt(values.paidAgency) : 0,
          agentPayout: values.agentPayout ? parseInt(values.agentPayout) : 0,
          netPayout: values.netPayout ? parseInt(values.netPayout) : 0,
          directCmorAgent: values.directCmorAgent,
          storageId: policyStorage_id as Id<"_storage">,
          customerStorageId: customerStorage_id as Id<"_storage">,
          fileUrl: editPolicy.fileUrl,
          customerFileUrl: editPolicy.customerFileUrl,
          oldFile: editPolicy.storageId as Id<"_storage">,
          oldCustomerFile: editPolicy.customerStorageId as Id<"_storage">,
          newFile,
          newCustomerFile,
        });

        toast.success("Changes saved successfully!");
        router.push("/home");
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! try again later");
    }
  };

  const deletePolicy = async () => {
    try {
      await fetchMutation(api.policies.deletePolicy, { id: editPolicy._id! });
      toast.success("Policy deleted successfully!");
      router.push("/home");
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong! try again later");
    }
  };

  return (
    <div className="w-screen flex justify-center ">
      <div className="rounded-xl border-gray-300 border mt-4 w-[96%] p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4 justify-between w-full max-md:flex-wrap ">
              <div className="flex justify-center flex-col gap-2 min-w-[300px] w-1/2  max-md:w-full max-md:items-center">
                <div className="flex items-center w-full gap-2 justify-between max-lg:flex-col">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col max-md:w-full">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  //@ts-expect-error: ignore this error
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          date of policy creation
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="policyEndDate"
                    render={({ field }) => (
                      <FormItem className="flex w-full flex-col max-md:w-full">
                        <FormLabel>Policy End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[240px] pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  //@ts-expect-error: ignore this error
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick End Date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>date of end of policy</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex w-full items-center gap-4 max-lg:flex-col max-lg:items-start">
                  <FormItem className="flex-1">
                    <FormLabel>Customer Documents</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload File"
                        onChange={(e) =>
                          setCustomerDocuments(e.target.files?.[0])
                        }
                        type="file"
                      />
                    </FormControl>
                    <FormDescription>
                      Update Customer Documents |{" "}
                      {editPolicy?.customerFileUrl ? (
                        <Link
                          href={editPolicy.customerFileUrl}
                          target="_blank"
                          className="cursor-pointer hover:underline text-blue-500  "
                        >
                          View File
                        </Link>
                      ) : (
                        <span className="cursor-pointer hover:underline text-red-500 ">
                          {" "}
                          No File
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                  <FormItem className="flex-1">
                    <FormLabel>Policy Documents</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Upload File"
                        onChange={(e) =>
                          setPolicyDocuments(e.target.files?.[0])
                        }
                        type="file"
                      />
                    </FormControl>
                    <FormDescription>
                      Update Policy Documents |{" "}
                      {editPolicy?.fileUrl ? (
                        <Link
                          href={editPolicy.fileUrl}
                          target="_blank"
                          className="cursor-pointer hover:underline text-blue-500  "
                        >
                          View File
                        </Link>
                      ) : (
                        <span className="cursor-pointer hover:underline text-red-500 ">
                          {" "}
                          No File
                        </span>
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>
              <div className="flex justify-center flex-col gap-2 min-w-[300px] w-1/2 max-md:w-full max-md:items-center">
                <FormField
                  control={form.control}
                  name="registeredOwnerName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Registered Owner Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Owner Name"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>
                        Fill Registered Owner Name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleUsedOwnerName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Vehicle Used Owner Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=" Vehicle Used Owner Name"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>
                        Fill vehicle Used Owner Name
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="vehicleManufacturingYear"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Vehicle Manufacturing Year</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vehicle Manufacturing year"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>
                      Fill Vehicle Manufacturing year
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleRegistrationNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Vehicle Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vehicle Registration Number"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>
                      Fill Vehicle Registration Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="customerMobileNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Customer Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Customer Mobile Number"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>
                      Fill Customer Mobile Number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleModel"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Vehicle Model</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === "other") {
                          setAddModel(true);
                        } else {
                          setAddModel(false);
                        }
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a vehicle model" />
                        </SelectTrigger>
                      </FormControl>
                      <FormDescription>Select Vehicle Model</FormDescription>
                      <FormMessage />
                      <SelectContent className="w-full">
                        <SelectItem value="other">Other</SelectItem>

                        {vehicleModels?.map((model, idx) => (
                          <SelectItem value={model} key={idx}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              {addModel && (
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Vehicle Model"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription>Fill Vehicle Model</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="anyVehicleWork"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Any Vehicle Work</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Any Vehicle Work"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Any Vehicle Work</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insuranceCompany"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Insurance Company</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insurance Company"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Insurance Company</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="insuranceAgency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Insurance Agency</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Insurance Agency"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Insurance Agency</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalPremium"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Total Premium</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Total Premium"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Total Premium</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="netPremium"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Net Premium</FormLabel>
                    <FormControl>
                      <Input placeholder="Net Premium" {...field} type="text" />
                    </FormControl>
                    <FormDescription>Fill Net Premium</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="idv"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>IDV</FormLabel>
                    <FormControl>
                      <Input placeholder="IDV" {...field} type="text" />
                    </FormControl>
                    <FormDescription>Fill IDV</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="cmCollectAmount"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>CM Collect Amount</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CM Collect Amount"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill CM Collect Amount</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paidAgency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Paid Agency</FormLabel>
                    <FormControl>
                      <Input placeholder="Paid Agency" {...field} type="text" />
                    </FormControl>
                    <FormDescription>Fill Paid Agency</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="agentPayout"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Agent Payout</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Agent Payout"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Agent Payout</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="netPayout"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Net Payout</FormLabel>
                    <FormControl>
                      <Input placeholder="Net Payout" {...field} type="text" />
                    </FormControl>
                    <FormDescription>Fill Net Payout</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center w-full max-md:flex-wrap gap-4">
              <FormField
                control={form.control}
                name="directCmorAgent"
                render={({ field }) => (
                  <FormItem className="w-1/2 max-md:w-full">
                    <FormLabel>Direct CM or Agent</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select CM or Agent" />
                        </SelectTrigger>
                      </FormControl>
                      <FormDescription>
                        Select Direct CM or Agent
                      </FormDescription>
                      <FormMessage />
                      <SelectContent className="w-full">
                        <SelectItem value="CM">CM</SelectItem>
                        <SelectItem value="Agent">Agent</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <div className="flex items-center w-1/2 max-md:w-full max-md:flex-wrap gap-4">
                <Button className="flex w-1/2 max-md:w-full max-md:flex-col cursor-pointer">
                  <ClipLoader
                    size={20}
                    color="#ffffff"
                    loading={form.formState.isSubmitting}
                  />
                  Save Policy
                </Button>
                <Button
                  type="button"
                  onClick={deletePolicy}
                  className="flex w-1/2 max-md:w-full max-md:flex-col cursor-pointer bg-red-400 hover:bg-red-500"
                >
                  Delete Policy
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditPolicy;
