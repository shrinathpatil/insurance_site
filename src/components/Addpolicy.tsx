"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
import { databases, ID, storage } from "@/lib/appwrite";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import {
  BucketId,
  DatabaseId,
  PolicyCollectionId,
  VehicleCollectionId,
} from "@/constants";
import { toast } from "sonner";

const AddPolicy = () => {
  const router = useRouter();
  const [vehicleModels, setVehicleModels] = useState<string[] | undefined>([]);
  const [addModel, setAddModel] = useState<boolean>(false);
  const [docFile, setDocFile] = useState<File | undefined>(undefined);
  useEffect(() => {
    const getVehicleModels = async () => {
      const models = await databases.listDocuments(
        DatabaseId,
        VehicleCollectionId
      );

      const modelNames = models.documents.map((model) => model.name);
      setVehicleModels(modelNames);
    };
    getVehicleModels();
  }, []);

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
      date: undefined,
      registeredOwnerName: "",
      vehicleUsedOwnerName: "",
      policyEndDate: undefined,
      vehicleManufacturingYear: "",
      vehicleRegistrationNumber: "",
      customerMobileNumber: "",
      vehicleModel: "",
      anyVehicleWork: "",
      insuranceCompany: "",
      insuranceAgency: "",
      totalPremium: "",
      netPremium: "",
      idv: "",
      cmCollectAmount: "",
      paidAgency: "",
      agentPayout: "",
      netPayout: "",
      directCmorAgent: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let fileId = "";
      if (docFile) {
        const file = await storage.createFile(BucketId, ID.unique(), docFile);
        fileId = file.$id;
      }

      const sDate = new Date(values.date).toLocaleString(undefined, {
        timeZone: "Asia/Kolkata",
      });
      const date = new Date(sDate);

      const sEndDate = new Date(values.policyEndDate).toLocaleString(
        undefined,
        {
          timeZone: "Asia/Kolkata",
        }
      );
      const endDate = new Date(sEndDate);

      await databases.createDocument(
        DatabaseId,
        PolicyCollectionId,
        ID.unique(),
        {
          ...values,
          date: date,
          policyEndDate: endDate,
          totalPremium: parseInt(values.totalPremium),
          netPremium: parseInt(values.netPremium),
          idv: parseInt(values.idv),
          cmCollectAmount: parseInt(values.cmCollectAmount),
          paidAgency: parseInt(values.paidAgency),
          agentPayout: parseInt(values.agentPayout),
          netPayout: parseInt(values.netPayout),
          fileId,
        }
      );
      toast.success("Policy Added Successfully!");
      router.push("/home");
    } catch (e) {
      console.log(e);
      toast.error("Failed to add policy!");
    }
  };

  return (
    <div className="w-screen flex justify-center ">
      <div className="rounded-xl border-gray-300 border mt-4 w-[96%] p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex items-center gap-4 justify-between w-full max-md:flex-wrap ">
              <div className="flex justify-center flex-col gap-2 min-w-[300px] w-1/2  max-md:w-full max-md:items-center">
                <div className="flex items-center w-full gap-2 justify-between">
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
                <FormItem className="w-full">
                  <FormLabel>Customer Documents</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Upload File"
                      onChange={(e) => setDocFile(e.target.files?.[0])}
                      type="file"
                    />
                  </FormControl>
                  <FormDescription>Upload Customer Documents</FormDescription>
                  <FormMessage />
                </FormItem>
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
                  <FormItem className="w-full">
                    <FormLabel>Direct CM or Agent</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Direct CM or Agent"
                        {...field}
                        type="text"
                      />
                    </FormControl>
                    <FormDescription>Fill Direct CM or Agent</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-1/2 cursor-pointer">
                <ClipLoader
                  size={20}
                  color="#ffffff"
                  loading={form.formState.isSubmitting}
                />
                Add Policy
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddPolicy;
