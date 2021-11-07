import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Disclosure, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { Controller, useForm, } from 'react-hook-form';
import Select from "react-select";
import AsyncSelect from 'react-select/async';
import format from "date-fns/format";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import DatePicker from '../../components/ui/datepicker';
import 'antd/dist/antd.css';
import { toast } from 'react-toastify';
import Layout from "../../components/layout";
import { Input } from "../../components/ui/forms";
import { classNames, styledReactSelect } from "../../components/utils";
import { ButtonSmall, ButtonSecondary } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import PageHeader from "../../components/incidents/page-header";
import docs from "../../components/incidents/docs.json"

function addIncident() {
    // Digunakan utuk fungsi reset form
    const defaultValues = {
        incidentName: "",
        idApps: "",
        startTime: "",
        endTime: "",
        impactedSystem: "",
        impact: "",
        rootCause: "",
        actionItem: "",
        responsibleEngineer: ""
    }
    const { register, handleSubmit, control, formState, reset, watch } = useForm({ defaultValues });
    const { errors, isSubmitting } = formState;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const router = useRouter();
    const [enabled, setEnabled] = useState(false);
    const [urgencyOptions, setUrgencyOptions] = useState([]);
    const watchStartTime = watch("startTime", false);
    const watchEndTime = watch("endTime", false);

    console.log(watchStartTime);


    // Get data urgency
    useEffect(() => {
        axios
            .get("https://ularkadut.xyz/v1.0/parameters/urgency")
            .then((response) => {
                const data = response.data.data.map(d => ({ "value": d.id, "label": d.urgency }))
                setUrgencyOptions(data)
            })
            .catch(err => toast.error(`Urgency ${err}`))
    }, [])

    // Get data applications
    const loadApplications = (value, callback) => {
        clearTimeout(timeoutId);

        if (value.length < 3) {
            return callback([]);
        }

        const timeoutId = setTimeout(() => {
            axios
                .get(`https://ularkadut.xyz/v1.0/parameters/app?name=${value}`)
                .then((res) => {
                    const cachedOptions = res.data.data.map(d => ({
                        "value": d.id,
                        "label": d.name
                    }))

                    callback(cachedOptions)
                })
                .catch(err => toast.error(`Application ${err}`))
        }, 500);
    }

    const handleSwitch = () => {
        if (enabled) {
            reset({
                endTime: "",
                impactedSystem: '',
                impact: "",
                rootCause: "",
                actionItem: "",
                responsibleEngineer: ""
            })
            setEnabled(false);
        } else {
            setEnabled(true);
        }
    }

    const onSubmit = async data => {
        // e.preventDefault();
        await sleep(500);
        // const formData = Object.assign(data, { idApps: data.idApps.value })
        // formData["startTime"] = format(new Date(formData.startTime), 'yyyy-MM-dd HH:mm:ss');
        // console.log(formData);

        // const res = 201;
        // if (res === 201) {
        //     !isSubmitting && toast.success("Incident successfully added");

        //     await sleep(3000);
        //     router.push('/');
        // } else {
        //     toast.error("Warning: Invalid DOM property `stroke-width`.");
        // }

        axios.post('https://ularkadut.xyz/v1.0/incidents', data)
            .then(function (response) {
                response.status === 201 ? alert('Data berhasil disimpan') : alert(`Gagal Error Code : ${response.status}`)
            })
            .catch(function (error) {
                console.log(error);
            });

    }

    return (
        <>
            <Layout>
                <Head>
                    <title>Incident Report - Add New Incident</title>
                </Head>
                {/* Page title & actions */}
                <PageHeader title="Create New Incident" />
                <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3 relative">
                    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                        {/* Section Incident Detail */}
                        <section aria-labelledby="create-new-incident">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Card Start */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg static">
                                    <div className="border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-6">
                                                <Input
                                                    name="incidentName"
                                                    register={register}
                                                    required="This is required"
                                                    label="Incident Name"
                                                    placeholder="Say what's happening. Example: Login page BRImo error"
                                                    className={errors.incidentName ? 'border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 ' : 'focus:ring-blue-500 focus:border-blue-500'}
                                                />
                                                {errors.incidentName && <p className="mt-2 text-sm text-red-600">{errors.incidentName.message}</p>}
                                            </div>
                                            {/* <div className="col-span-6 sm:col-span-3">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Application</label>
                                                <Controller
                                                    name="idApps"
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    render={({ field }) => (
                                                        <AsyncSelect
                                                            {...field}
                                                            isClearable
                                                            loadOptions={loadApplications}
                                                            styles={styledReactSelect}
                                                            className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                                            placeholder="Type an Application"
                                                        />
                                                    )}
                                                />
                                                {errors.idApps && <p className="mt-2 text-sm text-red-600">{errors.idApps.message}</p>}
                                            </div> */}

                                            {/* <div className="col-span-6 sm:col-span-2">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                                <Controller
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    name="startTime"
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            placeholderText="Select date"
                                                            onChange={(e) => field.onChange(e)}
                                                            selected={field.value}
                                                            isClearable
                                                            showTimeSelect
                                                            dateFormat="d MMMM yyyy HH:mm"
                                                            timeFormat="HH:mm"
                                                        />
                                                    )}
                                                />
                                                {errors.startTime && <p className="mt-2 text-sm text-red-600">{errors.startTime.message}</p>}
                                            </div> */}

                                            {/* <div className="col-span-6 sm:col-span-3">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                                <Controller
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    name="startTime"
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            allowClear
                                                            showTime={{ format: 'HH:mm' }}
                                                            format="d MMMM yyyy HH:mm"
                                                            onChange={(e) => field.onChange(e)}
                                                            value={field.value}
                                                            style={{
                                                                borderRadius: "0.375rem",
                                                                width: "100%",
                                                                height: "38px"
                                                            }}
                                                        />
                                                    )}
                                                />
                                                {errors.startTime && <p className="mt-2 text-sm text-red-600">{errors.startTime.message}</p>}
                                            </div> */}

                                            <div className="flex items-center space-x-3 col-span-6 sm:col-span-6">
                                                <Switch
                                                    checked={enabled}
                                                    onChange={handleSwitch}
                                                    className={classNames(
                                                        enabled ? 'bg-blue-600' : 'bg-gray-200',
                                                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                    )}
                                                >
                                                    <span className="sr-only">Use setting</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            enabled ? 'translate-x-5' : 'translate-x-0',
                                                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                        )}
                                                    />
                                                </Switch>
                                                <div>
                                                    <label className="block text-sm font-regular text-gray-700">Is the incident over ?</label>
                                                    <span className="inline-block align-top text-xs text-gray-400">Please switch the toggle if the incident is over</span>
                                                </div>
                                            </div>
                                            {/* Jika kondisi incident sudah selesai */}
                                            {enabled === true &&
                                                <>
                                                    <div className="col-span-6 sm:col-span-3">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">End Time</label>
                                                        <Controller
                                                            name="endtTime"
                                                            control={control}
                                                            rules={{
                                                                required: "This is required",
                                                                validate: (endtTime) => endtTime > watch("startTime")
                                                            }}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    allowClear
                                                                    showTime={{ format: 'HH:mm' }}
                                                                    format="d MMMM yyyy HH:mm"
                                                                    onChange={(e) => field.onChange(e)}
                                                                    value={field.value}
                                                                    style={{
                                                                        borderRadius: "0.375rem",
                                                                        width: "100%",
                                                                        height: "38px"
                                                                    }}
                                                                />
                                                            )}
                                                        // onChange={handleOnchange}
                                                        />
                                                        {errors.endtTime && <p className="mt-2 text-sm text-red-600">{errors.endtTime.message}</p>}
                                                    </div>
                                                    <div className="col-span-6 sm:col-span-6">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Impacted System</label>
                                                        <textarea
                                                            {...register("impactedSystem", { required: 'This is required' })}
                                                            id="impactedSystem"
                                                            name="impactedSystem"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                            placeholder=""
                                                            defaultValue={''}
                                                        />
                                                        {errors.impactedSystem && <p className="mt-2 text-sm text-red-600">{errors.impactedSystem.message}</p>}
                                                    </div>
                                                    <div className="col-span-6 sm:col-span-6">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Impact</label>
                                                        <textarea
                                                            {...register("impact", { required: 'This is required' })}
                                                            id="impact"
                                                            name="impact"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                            placeholder="Describe the impact"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 sm:col-span-6">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Root Cause</label>
                                                        <textarea
                                                            {...register("rootCause", { required: 'This is required' })}
                                                            id="rootCause"
                                                            name="rootCause"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                            placeholder="Describe the Root Cause Analysis (RCA)"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 sm:col-span-6">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Action Items</label>
                                                        <textarea
                                                            {...register("actionItem", { required: 'This is required' })}
                                                            id="actionItem"
                                                            name="actionItem"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                            placeholder="Describe the Actions"
                                                        />
                                                    </div>
                                                    <div className="col-span-6 sm:col-span-6">
                                                        <label className="mb-1 block text-sm font-medium text-gray-700">Responsible Engineer</label>
                                                        <textarea
                                                            {...register("responsibleEngineer", { required: 'This is required' })}
                                                            id="responsibleEngineer"
                                                            name="responsibleEngineer"
                                                            rows={3}
                                                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                            placeholder="Mention the engineer team. Example : SDK, CAO, etc."
                                                        />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
                                        <ButtonSmall
                                            type="submit"
                                            className={isSubmitting ? 'disabled:opacity-50 cursor-not-allowed' : ''}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <Spinner />}
                                            Save
                                        </ButtonSmall>
                                        <ButtonSecondary
                                            onClick={() => {
                                                reset(defaultValues);
                                            }}
                                        >
                                            Reset
                                        </ButtonSecondary>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Start Docs Panel */}
                    <section aria-labelledby="docs-title" className="lg:col-start-3 lg:col-span-1">
                        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                            <h2 id="timeline-title" className="text-lg font-medium text-gray-900 inline-flex items-center">
                                <QuestionMarkCircleIcon className="-ml-1 mr-2 h-6 w-6 text-blue-500" aria-hidden="true" />
                                Docs
                            </h2>
                            <dl className="space-y-3 divide-y divide-gray-200">
                                {docs.map((doc) => (
                                    <Disclosure as="div" key={doc.id} className="pt-3">
                                        {({ open }) => (
                                            <>
                                                <dt className="text-lg">
                                                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400 text-base">
                                                        <span className="font-normal text-base text-gray-900">{doc.title}</span>
                                                        <span className="ml-6 h-7 flex items-center">
                                                            <ChevronDownIcon
                                                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Disclosure.Button>
                                                </dt>
                                                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                    <p className="text-sm font-medium text-gray-900">{doc.bodyHeader}</p>
                                                    <ul className="list-disc list-inside text-gray-500 text-sm">
                                                        {doc.bodyContent.map((bc) => (
                                                            <li key={bc.id}>{bc.text}</li>
                                                        ))}
                                                    </ul>
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                ))}
                            </dl>
                        </div>
                    </section>
                    {/* End of Docs Panel */}
                </div>
            </Layout>
        </>
    );
}

export default addIncident;
